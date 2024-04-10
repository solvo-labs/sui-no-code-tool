module vesting::vesting_contract {
  use std::string;
  use sui::transfer;
  use sui::object::{Self, UID};
  use sui::table::{Self, Table}; 
  use sui::tx_context::{Self, TxContext};
  use sui::coin::{Self, Coin};
  use sui::balance::{Self,Balance};
  use sui::clock::{Self, Clock};

  struct CustomVestingInitializer has key {
    id: UID,
    count: u64,
  }

  // ownable object
  struct VestingRecord has key {
    id: UID,
    name : string::String,
    items: Table<u64, address>,
  }

  // ownable object
  struct VestingItem<phantom T> has key, store {
    id: UID,
    start_date: u64,
    end_date: u64,
    cliff_date: u64,
    period: u64,
    claimed_balance: u64,
    vesting_balance : Balance<T>
  }

  fun init(ctx: &mut TxContext) {
    let custom_vesting_initializer = CustomVestingInitializer {
        id: object::new(ctx),
        count: 0,
    };
    transfer::share_object(custom_vesting_initializer);

  }

  // owner function
  public fun init_vesting(name : vector<u8> ,ctx: &mut TxContext) : VestingRecord {
      VestingRecord {
         id: object::new(ctx),
         name: string::utf8(name),
         items : table::new(ctx)
      }
  }

  public entry fun transfer_vesting_record(vesting_record : VestingRecord,ctx: &mut TxContext) {
     transfer::transfer(vesting_record, tx_context::sender(ctx));
  }

  public entry fun create_vesting<T>(vesting_record : &mut VestingRecord,start_date : u64 , end_date : u64 ,cliff_date : u64 , period : u64 , pay_balance : Coin<T> ,destination : address ,ctx: &mut TxContext ){
    let vesting_object_id = object::new(ctx);
    let vesting_object_address = object::uid_to_address(&vesting_object_id);
   
    let vesting_item = VestingItem<T>{
       id: vesting_object_id,
       start_date,
       end_date,
       cliff_date,
       period,
       claimed_balance : 0,
       vesting_balance : coin::into_balance<T>(pay_balance)
    };

    transfer::public_transfer(vesting_item, destination);

    let index = table::length(&vesting_record.items);

    table::add(&mut vesting_record.items, index + 1, vesting_object_address);
  }

  public entry fun claim<T>(item : &mut VestingItem<T>, clock : &Clock,ctx: &mut TxContext){
    let end_date = clock::timestamp_ms(clock);
    
    if(end_date > item.end_date){
      end_date = item.end_date
    };

    let coin_balance_value = balance::value(&item.vesting_balance) + item.claimed_balance;

    let elapsed_time = end_date - item.start_date - item.cliff_date;

    let current_period = elapsed_time / item.period;

    let per_period_revenue = coin_balance_value / ((item.end_date - item.start_date) - item.cliff_date);

    let revenue = current_period * per_period_revenue;

    item.claimed_balance = revenue;
    transfer::public_transfer(coin::take(&mut item.vesting_balance ,revenue , ctx), tx_context::sender(ctx));
  }
}