import React, { useCallback, useEffect, useState } from "react"
import {Table, Button} from "react-bootstrap"
import { useLocation, useParams} from "react-router-dom"
import { getElection, getVotes, vote } from "../utils/election";
import { toast } from "react-toastify";
import { NotificationSuccess, NotificationError } from "./Notifications";
import Loader from "./Loader";

export default function ViewElection(){

  const [election, setElection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState([])
  const [voted, setVoted] = useState(false)
  

  const { id } = useParams();
  const electionId = parseInt(id)
  

  const getElectionItem = useCallback(async () => {
    try {
      setLoading(true);
      setElection(await getElection(electionId));
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const getVote = useCallback(async () => {
    try {
      setLoading(true);
      setVotes(await getVotes(electionId));
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });


  const voteCandidate = async (candidate) => {
    const time = Date.now();
    try {
      setLoading(true)
        await vote(
          electionId,
          candidate,
          time
        ).then((resp) => getVote());
        toast(<NotificationSuccess text="Voted successfully" />);
      } catch (error) {
          let err =  "Failed to Vote"
          try {
            err = error.kind.ExecutionError.split(",")[0].split("'")[1]
            setVoted(true)
          }
          finally {toast(<NotificationError text={err} />);}
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    getElectionItem();
  
  }, []);

  useEffect(() => {
    getVote();
  
  }, []);

    return (
      !loading ? <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Candidate</th>
            <th>Votes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {election[1] != null ? election[1].map((candidate, index) => (
                  <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{candidate}</td>
                      <td>{votes[candidate]}</td>
                      <td>
                        <Button
                        disabled={voted}
                        onClick={() => voteCandidate(candidate)}
                        variant="outline-dark"
                        className="rounded-pill px-3 mt-3">
                        Vote
                        </Button>
                      </td>
                  </tr> )) : null
          }        
        </tbody> 
      </Table> : <Loader />
    )
}