import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "react-dates/initialize";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
