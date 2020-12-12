import React, { useReducer } from "react";
import MessagesContext from "./MessagesContext";
import MessagesReducer from "./MessagesReducer";
import { v4 as uuid } from "uuid";
import { NEW_MESSAGE, SET_USERNAME, GET_MESSAGES } from "../types";

import PubNub from "pubnub";
import pubnubConfig from "../../pubnub.config.json";

const MessagesState = (props) => {
  const MESSAGE_CHANNEL = "MESSAGE_CHANNEL";
  const pubnub = new PubNub(pubnubConfig);
  function PubSub() {
    this.addListener = (listenerConfig) => {
      pubnub.addListener(listenerConfig);
    };

    this.publish = (message) => {
      // console.log("publish message", typeof message);
      console.log(message);
      pubnub.publish({
        message,
        channel: MESSAGE_CHANNEL,
      });
    };
  }
  const pubsub = new PubSub();
  const initialState = {
    messages: [],
    prevMessages: null,
    username: "anonymous",
    reactionsMap: {},
    pubsub: pubsub,
  };

  const [state, dispatch] = useReducer(MessagesReducer, initialState);

  const newMessage = ({ text, username }) => {
    dispatch({
      type: NEW_MESSAGE,
      item: { id: uuid(), text, username, timestamp: Date.now() },
    });
  };

  const getMessages = () => {
    pubnub
      .fetchMessages({
        channels: [MESSAGE_CHANNEL],

        count: 55, // default/max is 25
      })
      .then(async (res) => {
        dispatch({
          type: GET_MESSAGES,
          item: res,
        });
      });
  };

  const setUsername = (username) => {
    dispatch({
      type: SET_USERNAME,
      username,
    });
  };

  const createReaction = ({ type, emoji, username, messageId }) => {
    dispatch({
      type,
      item: { id: uuid(), timestamp: Date.now(), emoji, username, messageId },
    });
  };

  return (
    <MessagesContext.Provider
      value={{
        messages: state.messages,
        username: state.username,
        reactionsMap: state.reactionsMap,
        pubsub: state.pubsub,
        newMessage,
        prevMessages: state.prevMessages,
        setUsername,
        createReaction,
        getMessages,
      }}
    >
      {props.children}
    </MessagesContext.Provider>
  );
};

export default MessagesState;
