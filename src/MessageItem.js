import React from "react";
import { useEffect, useContext, useState } from "react";
import MessagesContext from "./context/Messages/MessagesContext";
const MessageItem = ({ message, actions }) => {
  const [text, setText] = useState("");
  const messagesContext = useContext(MessagesContext);
  const {
    pubsub: { addMessageAction },
    prevChannel1Actions,

    getActions,
  } = messagesContext;

  const messageActions =
    actions && actions.length > 0
      ? actions.filter((item) => {
          return item.messageTimetoken === message.timetoken;
        })
      : [];

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onClick = (channel, messageToken, reactionText) => {
    addMessageAction(channel, messageToken, reactionText);
  };
  console.log(actions);
  return (
    <div style={{ border: "1px solid red" }}>
      <p>{message.message.item.text}</p>
      <input
        type='text'
        value={text}
        onChange={(e) => {
          onChange(e);
        }}
      />
      <input
        type='submit'
        value='submit reaction'
        onClick={() => {
          onClick("CHANNEL1", message.timetoken, text);
        }}
      />

      {messageActions.map((action) => {
        return <div>{action.value}</div>;
      })}
    </div>
  );
};

export default MessageItem;
