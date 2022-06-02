import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddElection from "./AddElection";
import Election from "./Election";
import Loader from "./Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "./Notifications";
import { createElection, deleteElection, getElection, getElections, startElection } from "../utils/election";


export default function Elections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);


 

  const getElectionsList = useCallback(async () => {
    try {
      setLoading(true);
      setElections(await getElections());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addElection = async (data) => {
  try {
    setLoading(true);
    await createElection(data).then((resp) => {
      toast(<NotificationSuccess text="Election added successfully." />);
      getElectionsList();
    }).catch ((error) => {
    let err =  "Failed to Create Election"
        try {
          err = error.kind.ExecutionError.split(",")[0].split("'")[1]
        } finally {
          toast(<NotificationError text={err} />);
        };
    });  
  } finally {
    setLoading(false);
  }
};

const start = async (id) => {
  try {
    setLoading(true);
   await startElection(id).then((resp) => {
      toast(<NotificationSuccess text="Election started." />);
      getElectionsList();
    }).catch(error => {
      let err =  "Failed to start Election"
        try {
          err = error.kind.ExecutionError.split(",")[0].split("'")[1]
        }
        finally {
          toast(<NotificationError text={err} />);
        };
    });
  } finally {
    setLoading(false);
  }
};

const del = async (id) => {
  try {
    setLoading(true);
    await deleteElection(id).then((resp) => {
      toast(<NotificationSuccess text="Election deleted successfully." />);
      getElectionsList();
    }).catch ((error) => {
        let err =  "Failed to delete Election"
        try {
          err = error.kind.ExecutionError.split(",")[0].split("'")[1]
        }
        finally {toast(<NotificationError text={err} />);};
    })  
  } finally {
    setLoading(false);
  }
};



useEffect(() => {
  getElectionsList();
}, []);

return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-center align-items-center mb-4">
            <AddElection  save={addElection}/>
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {elections.map((_election, _index) => (
              <Election key={_index} 
                election={{
                  id: _election[0],
                  position: _election[2],
                  description: _election[3],
                  endTime: _election[4],
                  votes: _election[5],
                  isActive: _election[6],
                  owner: _election[7]
                }}
                del={del}
                start={start}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};