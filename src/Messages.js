import React from "react";
import { useEffect, useContext, useState } from "react";
import MessagesContext from "../src/context/Messages/MessagesContext";
const Messages = () => {
  const messagesContext = useContext(MessagesContext);
  const {
    pubsub: {
      fetchMessages,
      publish,
      addListener,
      addMessageAction,
      getMessageActions,
    },
    pubsub,
    newMessage,
    messages,
    prevMessages,
    getMessages,
  } = messagesContext;
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
        username: "anonymoudtyyyts",
      },

      type: "NEW_MESSAGE",
    });
  };
  const addReaction = () => {
    addMessageAction();
  };

  const getMessageReactions = () => {
    getMessageActions();
  };

  useEffect(() => {
    getMessages();
  }, []);
  console.log(prevMessages);
  //const {c} = prevMessages

  useEffect(() => {
    addListener({
      message: (messageObject) => {
        const { channel, message, timetoken } = messageObject;
        const obj = {
          channel,
          message,
          timetoken,
        };
        console.log("Received message", messageObject, "channel", channel);

        newMessage(obj);
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
      <input
        type='submit'
        value='addreact'
        onClick={() => {
          addReaction();
        }}
      />
      <input
        type='submit'
        value='getreact'
        onClick={() => {
          getMessageReactions();
        }}
      />
      {prevMessages !== null ? (
        prevMessages
          .filter((message) => {
            return message.message.item.text;
          })
          .map((message) => {
            return <p>{message.message.item.text}</p>;
          })
      ) : (
        <p>No messages</p>
      )}
    </div>
  );
};

export default Messages;
