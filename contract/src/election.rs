use std::collections::HashMap;

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, AccountId};
use near_sdk::collections::{LookupMap};


#[derive(BorshDeserialize, BorshSerialize)]
pub struct Election {
    pub id: u32,
    pub candidates: Vec<String>,
    scores: LookupMap<String, u32>,
    pub position: String,
    pub description: String,
    pub votes: u64,
    pub is_active: bool,
    voted: LookupMap<AccountId, bool>,
    pub end_time: u64,
    pub owner: AccountId,


}

impl Election {

    pub fn new(
        id: u32, 
        candidates: Vec<String>, 
        description: String,
        end_time: u64,
        position: String
    ) -> Self {

        let election = Self{
            id,
            is_active: false,
            candidates,
            scores: LookupMap::new(format!("s{}", id).as_bytes()),
            voted: LookupMap::new(format!("ve{}", id).as_bytes()),
            votes: 0,
            position,
            description,
            end_time,
            owner: env::signer_account_id()
        };
        election
    }

    pub fn vote(&mut self, candidate: String) {
        assert!(&self.is_active, "Election is yet to start");
        assert!(&self.end_time > &(env::block_timestamp()/1000000), "Election is closed");
        assert!(!&self.voted.contains_key(&env::signer_account_id()), "Already voted");
        let vote =  match  &self.scores.get(&candidate) {

           Some(v) =>  v +1,
           None => 1

        };
        let _ = &self.scores.insert(&candidate, &vote);
        self.votes = self.votes + 1;
        let _ = &self.voted.insert(&env::signer_account_id(), &true);

    }

    pub fn start_election(&mut self) {
        assert_eq!(&self.owner, &env::signer_account_id(), "Not Authourized");
        assert!(!self.is_active, "Already Started");
        self.end_time = env::block_timestamp()/1000000 + (self.end_time * (60 * 60 * 1000));
        self.is_active = true;

    }

    pub fn get_votes(&self) -> HashMap<String, u32> {
        let mut scores: HashMap<String, u32> = HashMap::new();
        for candidate in &self.candidates {
            let vote = match &self.scores.get(candidate) {
                Some(v) => *v,
                None => 0
            };
            scores.insert(candidate.to_string(), vote);
        }

        scores
    }
}