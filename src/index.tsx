import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import harfbuzz from "harfbuzzjs";
import App from "./App";
import appReducer from "./store/reducer";

declare let window: any;

const store = createStore(appReducer, applyMiddleware(thunk));
harfbuzz.then((hbjs: any) => {
  window.hbjs = hbjs;

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
});
