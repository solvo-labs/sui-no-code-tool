// REF https://github.com/MystenLabs/satoshi-coin-flip/blob/main/satoshi_flip/sources/counter_nft.move

/// This module implements a simple, non transferable counter NFT.
/// Creates a counter object that can be incremented and burned.
/// The counter NFT is non transferable, i.e. it can only be ever owned by one account.
module raffle::counter_nft {
    use std::vector;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};
    use sui::bcs::{Self};

    /// Counter object that is used as a unique VRF input for each satoshi coin flip game.
    /// To achieve this, the Counter NFT is flattened into a vector<u64> value containing the Counter NFT ID + the current count.
    struct Counter has key {
        id: UID,
        count: u64,
    }

    /// Deletes a counter object.
    entry fun burn(self: Counter) {
        let Counter { id, count: _ } = self;
        object::delete(id);
    }

    /// Creates a new counter object. Used in combination with the transfer_to_sender method to provide the same 
    /// UX when creating a Counter NFT for the first time.
    public fun mint(ctx: &mut TxContext): Counter {
        Counter {
            id: object::new(ctx),
            count: 0
        }
    }

    /// Transfers a counter object to the sender.
    public fun transfer_to_sender(counter: Counter, ctx: &mut TxContext) {
        transfer::transfer(counter, tx_context::sender(ctx));
    }

    /// Calculates the Counter NFT ID + count and returns the appended result as a vector<u8>.
    /// Then it increases the count by 1 and returns the appended bytes.
    public fun get_vrf_input_and_increment(self: &mut Counter): vector<u8> {
        let vrf_input = object::id_bytes(self);
        let count_to_bytes = bcs::to_bytes(&count(self));
        vector::append(&mut vrf_input, count_to_bytes);
        increment(self);
        vrf_input
    }

    /// Returns the current count of the counter object.
    public fun count(self: &Counter): u64 {
        self.count
    }

    // === Internal ===

    /// Internal function to increment the counter by 1.
    fun increment(self: &mut Counter) {
        self.count = self.count + 1;
    }

    #[test_only]
    public fun burn_for_testing(self: Counter) {
        burn(self);
    }
}