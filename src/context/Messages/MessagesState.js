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
    pubnub.subscribe({ channels: [MESSAGE_CHANNEL] });

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
    this.addMessageAction = () => {
      pubnub.addMessageAction({
        channel: "MESSAGE_CHANNEL",
        messageTimetoken: "16078247625210876",
        action: {
          type: "reaction",
          value: "Thus us my realeutetetutjte face",
        },

        function(status, response) {
          console.log(status, response);
        },
      });
    };

    this.getMessageActions = () => {
      pubnub.getMessageActions(
        {
          channel: "MESSAGE_CHANNEL",
          limit: 100,
        },
        function (status, response) {
          console.log(status, response);
        }
      );
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

  const newMessage = (obj) => {
    dispatch({
      type: NEW_MESSAGE,
      item: obj,
    });
  };

  const getMessages = () => {
    pubnub
      .fetchMessages({
        channels: [MESSAGE_CHANNEL],

        count: 75, // default/max is 25
      })
      .then(async (res) => {
        dispatch({
          type: GET_MESSAGES,
          item: res.channels.MESSAGE_CHANNEL,
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
