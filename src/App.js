import { MessagesState, pubsub } from "../src/context/Messages/MessagesState";
import Messages from "./Messages";
import { useEffect, useContext, useState } from "react";

function App() {
  return (
    <MessagesState>
      <Messages />
    </MessagesState>
  );
}

export default App;
