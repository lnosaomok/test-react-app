import MessagesState from "../src/context/Messages/MessagesState";
import Messages from "./Messages";
function App() {
  return (
    <MessagesState>
      <Messages />
    </MessagesState>
  );
}

export default App;
