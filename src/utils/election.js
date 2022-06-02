import { v4 as uuid4 } from "uuid";


export function createElection(election) {
  return window.contract.create_election( election );
}

export function getElections() {
  const election =  window.contract.get_elections();
  return election
}

export function getElection(id) {
    return window.contract.get_election({id})
}

export async function vote( id, candidate, time ) {
  await window.contract.vote({ id, candidate });
}

export function getVotes(id) {
    return window.contract.get_votes({id});
}

export function deleteElection(id) {
    return window.contract.delete_election({id});
}

export function startElection(id, time) {
    return window.contract.start_election({id});
}

