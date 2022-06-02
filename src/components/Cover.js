import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { Space } from "antd";
import { login } from "../utils/near";
import coverImg from "../assets/img/cover1.jpg";

const Cover = () => {
    return (
      <div
        className="d-flex justify-content-center flex-column text-center "
        style={{ background: "#000", backgroundSize: 'cover', minHeight: "100vh", backgroundImage: `url(${coverImg})` }}
        
      >
        <div className="mt-auto text-light mb-5">
          <Space style={{ marginTop: 40 }}>
          <div>
            <h2  style={{ background: "#000", backgroundSize: 'cover'}}>Welcome to Election-is-near...</h2>
            <br/> <br/>
             <h3 style={{ background: "#000", backgroundSize: 'cover'}}>Home to credible elections</h3>
             <p style={{ background: "#000", backgroundSize: 'cover'}}>Simply connect to your near wallet to create an election or simply vote for your candidate in an ongoing election.</p>
          </div>
          </Space>
          <br/> <br/>
          <p style={{ color: "magenta", backgroundColor: "black"}}>Ready to vote or start an election?</p>
          <Button
            onClick={ login}
            variant="primary"
            className="rounded-pill px-3 mt-3"
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    );
};

Cover.propTypes = {
  name: PropTypes.string,
};

Cover.defaultProps = {
  name: "",
};

export default Cover;