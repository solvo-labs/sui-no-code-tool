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
   use sui::hmac::hmac_sha3_256;
   use raffle::counter_nft::{Self, Counter};

     /// For when Coin balance is too low.
  const ENotEnough: u64 = 0;
  const ENotAdmin: u64 = 1;
  const EWinnerAlreadyExist: u64 = 2;
  const EWrongTicket: u64 = 3;
  const EWaitingClaim: u64 = 4;
  const EEndTimeExpire: u64 = 5;
  const EEndTimeDoesntExpire: u64 = 6;

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
        vrf_input: vector<u8>,
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

  public entry fun create_raffle<T>(custom_raffles : &mut CustomRaffles ,name : vector<u8>, ticket_price : u64 ,period : u64 , balance : Coin<T> ,counter: &mut Counter, clock: &Clock ,ctx: &mut TxContext) {
    let table_uid = object::new(ctx);
    let table_address = object::uid_to_address(&table_uid);

    let vrf_input = counter_nft::get_vrf_input_and_increment(counter);

    let raffle = Raffle<T> {
            id: table_uid,
            name : string::utf8(name),
            participants : vector::empty<address>(),
            end_time : clock::timestamp_ms(clock) + period,
            ticket_count : 0,
            ticket_price,
            reward : coin::into_balance<T>(balance),
            winner : option::none(),
            owner : tx_context::sender(ctx),
            balance : balance::zero(),
            claimed : false,
            vrf_input,  
    };

   transfer::share_object(raffle);

   let index = table::length(&custom_raffles.raffles);

   table::add(&mut custom_raffles.raffles, index + 1, table_address);
  }
  
  public entry fun buy_ticket<T>(raffle: &mut Raffle<T>, payment: &mut Coin<SUI>, clock: &Clock , ctx: &mut TxContext){
    assert!(coin::value(payment) >= raffle.ticket_price, ENotEnough);
    assert!(raffle.end_time >= clock::timestamp_ms(clock), EEndTimeExpire);

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

  public entry fun draw<T>(raffle : &mut Raffle<T>, bls_sig : vector<u8>,clock: &Clock, ctx: &mut TxContext ) {
    assert!(tx_context::sender(ctx) == raffle.owner, ENotAdmin);
    assert!(option::is_none(&raffle.winner), EWinnerAlreadyExist);
    assert!(raffle.end_time < clock::timestamp_ms(clock), EEndTimeDoesntExpire);

    let random = hmac_sha3_256(&bls_sig, &object::id_to_bytes(&object::id(raffle)));
    let winner = safe_selection(raffle.ticket_count, &random);
    
    raffle.winner = option::some(winner);
  }

  public entry fun complete<T>(raffle: &mut Raffle<T> ,clock: &Clock, ctx: &mut TxContext){
      assert!(raffle.claimed == true, EWaitingClaim);
      assert!(tx_context::sender(ctx) == raffle.owner, ENotAdmin);
      assert!(raffle.end_time < clock::timestamp_ms(clock), EEndTimeDoesntExpire);

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


  // getters
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

  public fun get_vrf_input<T>(raffle: &Raffle<T>): vector<u8> {
        raffle.vrf_input
  }

  // ref -> https://github.com/MystenLabs/sui/blob/main/sui_programmability/examples/games/sources/drand_lib.move#L67
  // Converts the first 16 bytes of rnd to a u128 number and outputs its modulo with input n.
  // Since n is u64, the output is at most 2^{-64} biased assuming rnd is uniformly random.
  public fun safe_selection(n: u64, rnd: &vector<u8>): u64 {
        let m: u128 = 0;
        let i = 0;
        while (i < 16) {
            m = m << 8;
            let curr_byte = *vector::borrow(rnd, i);
            m = m + (curr_byte as u128);
            i = i + 1;
        };
        let n_128 = (n as u128);
        let module_128  = m % n_128;
        let res = (module_128 as u64);
        res
  }

  public entry fun get_winner<T>(raffle : &Raffle<T>) : address {
    raffle.winner
  }
}