import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { io } from "socket.io-client";

import App from "./App";

const socket = io('http://localhost:3000');

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App socket={socket}/>
  </React.StrictMode>
);
