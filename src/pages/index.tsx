import { Provider } from "react-redux";
import { ClientOnly } from "../client";
import store from "../store/index";
import React from "react";

export function generateStaticParams() {
  return [{ slug: [""] }];
}

export default function Page() {
    return (
      <Provider store={store}>
        <ClientOnly />
      </Provider>
    );
}
