import React from "react";
import { useEffect, useContext, useState } from "react";
import MessagesContext from "../src/context/Messages/MessagesContext";
const Messages = () => {
  const messagesContext = useContext(MessagesContext);
  const [messagesArr, setMessagesArr] = useState("");

  const onChange = (e) => {
    setMessagesArr(e.target.value);
  };

  const publishMessage = () => {
    // console.log(newMessage({ text, username }));
    publish({
      item: {
        id: "b0290cf0-0cf7-4357-8ba6-2448e445c146",
        text: messagesArr,
        timestamp: 160774360691909,
        username: "anonymoudts",
      },

      type: "NEW_MESSAGE",
    });
  };

  const {
    pubsub: { fetchMessages, publish },
    pubsub,
    newMessage,
    prevMessages,
    getMessages,
  } = messagesContext;
  useEffect(() => {
    getMessages();
  }, []);
  console.log(prevMessages);
  useEffect(() => {
    pubsub.addListener({
      message: (messageObject) => {
        const { channel, message } = messageObject;

        console.log("Received message", message, "channel", channel);

        newMessage(message);
      },
    });
  }, []);

  return (
    <div>
      <input
        type='text'
        value={messagesArr}
        onChange={(e) => {
          onChange(e);
        }}
      />
      <input type='submit' value='submit' onClick={publishMessage} />
      {/* {messages.map((messageItem) => {
        const { id, text, username, timestamp } = messageItem;

        return (
          <div key={id}>
            <h4>{new Date(timestamp).toLocaleString()}</h4>
            <p>{text}</p>
            <h4>- {username}</h4>

            <hr />
          </div>
        );
      })} */}
    </div>
  );
};

export default Messages;
