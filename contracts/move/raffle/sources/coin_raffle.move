module raffle::coin_raffle {
   use std::vector;
   use std::string;
   use sui::transfer;
   use sui::object::{Self, UID , ID};
   use sui::tx_context::{Self, TxContext};
   use sui::coin::{Self, Coin};
   use sui::balance::{Self, Balance};
   use sui::table::{Self, Table}; 
   use std::option::{Self, Option};
   use sui::clock::{Self, Clock};
   use sui::sui::{SUI};

     /// For when Coin balance is too low.
  const ENotEnough: u64 = 0;
  const ENotAdmin: u64 = 1;
  const EWinnerAlreadyExist: u64 = 2;
  const EWrongTicket: u64 = 3;
  const EWaitingClaim: u64 = 4;

  struct CustomRaffles has key , store {
        id: UID,
        raffles : Table<u64 , address>,
  }

  struct Raffle <phantom T>  has key {
        id: UID,
        name: string::String,
        participants: vector<address>,
        end_time:u64,
        ticket_count: u64,
        ticket_price: u64,
        reward: Balance<T>,
        balance: Balance<SUI>,
        winner : Option<u64>,
        owner : address,
        claimed : bool,
  }

  struct Ticket has key ,store {
        id: UID,
        raffle_id: ID,
        ticket_no: u64,
  }

  fun init(ctx: &mut TxContext) {
         let raffle_table = CustomRaffles {
            id: object::new(ctx),
            raffles: table::new(ctx)
        };
       
      transfer::share_object(raffle_table);
  }

  public entry fun create_raffle<T>(custom_raffles : &mut CustomRaffles ,name : vector<u8>, ticket_price : u64 , balance : Coin<T> ,end_time: &Clock, ctx: &mut TxContext) {
    let table_uid = object::new(ctx);
    let table_address = object::uid_to_address(&table_uid);

    let raffle = Raffle<T> {
            id: table_uid,
            name : string::utf8(name),
            participants : vector::empty<address>(),
            end_time : clock::timestamp_ms(end_time),
            ticket_count : 0,
            ticket_price,
            reward : coin::into_balance<T>(balance),
            winner : option::none(),
            owner : tx_context::sender(ctx),
            balance : balance::zero(),
            claimed : false,
    };

   transfer::share_object(raffle);

   let index = table::length(&custom_raffles.raffles);

   table::add(&mut custom_raffles.raffles, index + 1, table_address);
  }
  
  public entry fun buy_ticket<T>(raffle: &mut Raffle<T>,payment: &mut Coin<SUI>, ctx: &mut TxContext){
    assert!(coin::value(payment) >= raffle.ticket_price, ENotEnough);

    let buyer = tx_context::sender(ctx);
    let participant_index = vector::length(&raffle.participants);

    let coin_balance = coin::balance_mut(payment);
    let total_balance = balance::split(coin_balance, raffle.ticket_price);

    balance::join(&mut raffle.balance, total_balance);

    let ticket = Ticket {
      id: object::new(ctx),
      raffle_id: object::id(raffle),
      ticket_no: raffle.ticket_count,
    };

    vector::insert(&mut raffle.participants, buyer,participant_index);
    raffle.ticket_count = raffle.ticket_count + 1;

    transfer::public_transfer(ticket, buyer);
  } 

  public entry fun draw <T>(raffle : &mut Raffle<T> ,ctx: &mut TxContext ) {
    assert!(tx_context::sender(ctx) == raffle.owner, ENotAdmin);

    raffle.winner = option::some(0);
  }

  public entry fun complete<T>(raffle: &mut Raffle<T> , ctx: &mut TxContext){
      assert!(raffle.claimed == true, EWaitingClaim);
      assert!(tx_context::sender(ctx) == raffle.owner, ENotAdmin);

      let balance = balance::value(&raffle.balance);
      let coin = coin::from_balance(balance::split(&mut raffle.balance, balance), ctx);
      sui::pay::keep(coin, ctx);
  }

  public entry fun claim_prize<T>(raffle: &mut Raffle<T>, ticket: Ticket, ctx: &mut TxContext) {
        assert!(raffle.claimed == false, EWinnerAlreadyExist);
        assert!(ticket.raffle_id == object::id(raffle), EWrongTicket);
        assert!(ticket.ticket_no == *option::borrow(&raffle.winner), EWrongTicket);

        let Ticket { id, raffle_id: _, ticket_no: _} = ticket;
        
        let winner = tx_context::sender(ctx);
        let total_reward = balance::value(&raffle.reward);
        transfer::public_transfer(coin::take(&mut raffle.reward ,total_reward , ctx), winner);

        object::delete(id);
        raffle.claimed = true;
  }

  public entry fun get_raffles(custom_raffles : &CustomRaffles) : vector<address> {
    let table_length = table::length(&custom_raffles.raffles);
    let index = 0;
    let results = vector::empty<address>();

    while ( index <= table_length ) {
            if ( table::contains(&custom_raffles.raffles, index) ) {
                let raffle_address = *table::borrow(&custom_raffles.raffles, index);
                vector::push_back(&mut results, raffle_address);
            };
            index = index + 1
        };
    return results
  }
}