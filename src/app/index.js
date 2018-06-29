import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import App from "./components/App";
import reducers from "./reducers";
import "./components/bundle.scss";

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(
  reducers,
  {},
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

function render() {
  return ReactDOM.render(
    <App store={store} />,
    document.getElementById("react-root")
  );
}

store.subscribe(render);
render();
