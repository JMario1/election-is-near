import React from 'react'
import ReactDOM from 'react-dom'
// import { createRoot } from 'react-dom'
import App from './App'
import { initContract } from './utils/near'

import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import ViewElection from "./components/ViewElection";
import { Notification } from "./components/Notifications";

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <>
        <Notification />
        <Router>
          <Routes>
            <Route path="election/:id" element={<ViewElection />} /> 
            <Route path="/" element={<App />}/>
          </Routes>
        </Router>
      </>,
      document.querySelector('#root')
      )
  })
  .catch(console.error)
