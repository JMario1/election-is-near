import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom"
import { Card, Col, Badge, Stack, Button, Row, Modal   } from "react-bootstrap";

export default function Election({ election, del, start }){
  const { id, position, description, votes, owner, isActive, endTime } =
    election;

  const [showDelete, setShowDelete] = useState(false);
  const [showStart, setShowStart] = useState(false);

  const handleClose = () => {
      setShowStart(false);
      setShowDelete(false);
  };
  const handleShow = (action) => {
    if(action === "start") setShowStart(true);
    if(action === "delete") setShowDelete(true);
  };
 
  const calculateTimeLeft = () => {
        let diff = endTime - Date.now();

        let timeLeft = {};

        if (diff > 0) {
            timeLeft = {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hrs: Math.floor((diff / (1000 * 60 * 60)) % 24),
            mins: Math.floor((diff / 1000 / 60) % 60),
            secs: Math.floor((diff / 1000) % 60)
            };
        }

        return timeLeft;
    }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())  

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });



  const showModal = (text, show) => {
    const time = Date.now();
    return (
       <Modal show={show} onHide={handleClose}>
        <Modal.Body>Please confirm you want {text} the election</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            text === "start" ? start(id, time) : del(id)
            handleClose(text)
          }}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  

  return (
    <div> 
    <Col key={id}>
      <Card className=" h-100" style={{opacity: 0.85, color: "magenta"}}>
        <Card.Header>
          <Stack direction="vertical">
            <span className="font-monospace text-center">{owner}</span>
            <Stack direction="horizontal">
            <Badge bg="primary">
              {votes} votes
            </Badge>
            <Badge bg="danger" className="ms-auto">
              { !isActive ? "Not Started" : timeLeft.secs !== undefined ? `${timeLeft.days} D : ${timeLeft.hrs} H : ${timeLeft.mins} M : ${timeLeft.secs} S`: "Ended"}
            </Badge>
          </Stack>
          </Stack>
        </Card.Header>
        <Card.Body className="d-flex  flex-column text-center" >
          <Card.Title>{position}</Card.Title>
          <Card.Text className="flex-grow-1 ">{description}</Card.Text>
          <Row xs={1} sm={3} lg={3}>
             <Col md="auto" ><Button variant="outline-primary" size="sm"><Link to={`election/${id}`} state={{id}}>View</Link></Button></Col>
            <Col md="auto"> <Button variant="outline-danger" size="sm" onClick={() => handleShow("delete")}>Delete</Button></Col>
            <Col md="auto"> <Button variant="outline-primary" size="sm" onClick={() => handleShow("start")} >Start</Button></Col> 
          </Row>
        </Card.Body>
      </Card>
    </Col>
    {showModal("start", showStart)}
    {showModal("delete", showDelete)}
    </div>
  );
};

Election.propTypes = {
  election: PropTypes.instanceOf(Object).isRequired,
};