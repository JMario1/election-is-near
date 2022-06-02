
mod election;

use std::collections::HashMap;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, setup_alloc, AccountId, env};
use near_sdk::collections::{UnorderedMap};
use election::*;

setup_alloc!();

// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
  elections: UnorderedMap<u32, Election>,
  counter: u32
}

impl Default for Contract {
    fn default() -> Self {
        Self { 
          elections: UnorderedMap::new(b'v'), 
          counter: 0 
        }
    }
}

#[near_bindgen]
impl Contract {
    
    pub fn create_election(
      &mut self,
      candidates: Vec<String>,
      end_time: u64,
      description: String,
      position: String
    ) {
      let id = self.counter;
      assert!(candidates.len() >= 2, "Minimum of 2 candidates needed");
      let election = Election::new(id, candidates, description, end_time, position);
      let _ = &self.elections.insert(&id, &election);
      self.counter += 1;
    }
    
    pub fn get_election(&self, id: u32) -> (u32, Vec<String>, String, String, u64, u64, bool, AccountId) {
      let election = self.elections.get(&id).unwrap();
      (
        election.id,
        election.candidates,
        election.position,
        election.description,
        election.end_time,
        election.votes,
        election.is_active,
        election.owner
      )
    }

    pub fn get_elections(&self) -> Vec<(u32, Vec<String>, String, String, u64, u64, bool, AccountId)> {

      let mut elections = Vec::new();
      for (_, election) in self.elections.iter() {
        elections.push(
          (
        election.id,
        election.candidates,
        election.position,
        election.description,
        election.end_time,
        election.votes,
        election.is_active,
        election.owner
      )
        )
      };
      elections
    }

    pub fn vote(&mut self, id: u32, candidate: String, end_time: u64) {
      if let  Some(mut e) = self.elections.get(&id) {
          e.vote(candidate, end_time);
          let _ = &self.elections.insert(&id, &e);
      }else {
          env::panic(b"could not vote");
      }
    }

    pub fn get_votes(&self, id: u32) -> Option<HashMap<String, u32>> {
      if let  Some(e) = &self.elections.get(&id) {
          Option::Some(e.get_votes())
      }else {
          Option::None
      }
      
    }

    pub fn start_election(&mut self, id: u32, time: u64) {
      if let  Some(mut e) = self.elections.get(&id) {
          e.start_election(time);
          let _ = &self.elections.insert(&id, &e);

      }else {
          env::panic(b"could not start");
      }
    }

    pub fn delete_election(&mut self, id: u32) {
      if let  Some(e) = self.elections.get(&id) {
         assert_eq!(&e.owner, &env::signer_account_id(), "Not Authourized");
          let _ = &self.elections.remove(&id);
      }else {
          env::panic(b"could not delete");
      }
    }
  
}






#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alice_near".to_string(),
            signer_account_id: "bob_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "carol_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn set_then_get_election() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Contract::default();
        contract.create_election(vec!["Ben".to_string(), "sam".to_string()], 3,"presidency electio".to_string(), "president".to_string());
        let election = contract.get_election(0);
        assert_eq!(
            vec!["Ben", "sam"],
            election.1
        );
        assert_eq!(
            "president".to_string(),
            election.2
        );
    }

    #[test]
    #[should_panic(expected="Election is yet to start")]
    fn vote_should_panic() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Contract::default();
        contract.create_election(vec!["Paul".to_string(), "Ken".to_string()], 3,"presidency electio".to_string(), "president".to_string());
        contract.vote(0, "Paul".to_string(), 2);
     
       
    }

    #[test]
    fn vote_then_get_votes() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = Contract::default();
        contract.create_election(vec!["Paul".to_string(), "Ken".to_string()], 3,"presidency electio".to_string(), "president".to_string());
        contract.start_election(0, 4);
        contract.vote(0, "Paul".to_string(), 5);
        let result = contract.get_votes(0).unwrap();
        assert_eq!(
            1,
            result["Paul"]
        );
     
       
    }
}
