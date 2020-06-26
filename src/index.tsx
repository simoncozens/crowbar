import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import appReducer from "./store/reducer";
import hbjs from "./hbjs";

declare let window: any;

const store = createStore(appReducer, applyMiddleware(thunk));
fetch("/harfbuzz.wasm").then((response) => response.arrayBuffer()).then((bytes) => WebAssembly.instantiate(bytes)).then((results) => {
  // @ts-ignore
  results.instance.exports.memory.grow(800);
  const hb = hbjs(results.instance); // Dirty but works
  window["harfbuzz"] = results.instance;
  window["hbjs"] = hb;

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
	  document.getElementById("root"),
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
