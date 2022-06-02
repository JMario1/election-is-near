import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { login, logout, accountBalance } from "./utils/near";
import Wallet from "./components/Wallet";
import { Notification } from "./components/Notifications";
import Cover from "./components/Cover";
import "./App.css";
import Elections from "./components/Elections";
import image from "./assets/img/c1.jpg"



export default function App() {
  const account = window.walletConnection.account();
  const [balance, setBalance] = useState("0");
  const getBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(await accountBalance());
    }
  });

  useEffect(() => {
    getBalance();
  }, [getBalance]);

    return (
    <>
   
      {account.accountId ? (
              <div style={{ backgroundImage: `url(${image})`, backgroundSize: "cover",  minHeight: "100vh"} }>
                <Container fluid="md">
                <Navbar>
                  <Navbar.Brand>
                    <h2 style={{color: "white"}}>Election-is-near</h2>
                  </Navbar.Brand>
                  <Navbar.Collapse className="justify-content-end">
                    <Nav>
                      <Nav.Item>
                        <Wallet
                          address={account.accountId}
                          amount={balance}
                          symbol="NEAR"
                          logout={logout}
                        />
                      </Nav.Item>
                    </Nav>
                  </Navbar.Collapse>
                </Navbar>
                <Elections />
              </Container>
              </div>
            ) : (
              <Cover />
            )} 
    </>
  );
};