import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import App from "./App";
import appReducer from "./store/reducer";
import hbjs from "./hbjs";

declare let window: any;

const store = createStore(appReducer, applyMiddleware(thunk));
fetch(`${process.env.PUBLIC_URL}/harfbuzz.wasm`)
  .then((response) => response.arrayBuffer())
  .then((bytes) => WebAssembly.instantiate(bytes))
  .then((results) => {
    // @ts-ignore
    const hb = hbjs(results.instance); // Dirty but works
    window.harfbuzz = results.instance;
    window.hbjs = hb;

    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  });
