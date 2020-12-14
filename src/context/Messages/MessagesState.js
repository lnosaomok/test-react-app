import React, { useReducer } from "react";
import MessagesContext from "./MessagesContext";
import MessagesReducer from "./MessagesReducer";
import { v4 as uuid } from "uuid";
import {
  NEW_MESSAGE,
  SET_USERNAME,
  GET_CHANNEL1_MESSAGES,
  GET_CHANNEL2_MESSAGES,
  GET_CHANNEL3_MESSAGES,
  GET_CHANNEL1_ACTIONS,
  NEW_IMAGE_FILE,
  GET_IMAGE_FILES,
  CHANNEL1_NEW_MESSAGE_ACTION,
} from "../types";

import PubNub from "pubnub";
import pubnubConfig from "../../pubnub.config.json";

const CHANNEL1 = "CHANNEL1";
const CHANNEL2 = "CHANNEL2";
const CHANNEL3 = "CHANNEL3";
const FILECHANNEL = "FILECHANNEL";

const pubnub = new PubNub(pubnubConfig);
function PubSub() {
  pubnub.subscribe({ channels: [CHANNEL1, CHANNEL2, CHANNEL3, FILECHANNEL] });

  this.addListener = (listenerConfig) => {
    pubnub.addListener(listenerConfig);
  };

  this.publish = (message, channel) => {
    // console.log("publish message", typeof message);
    console.log(message);
    pubnub.publish({
      message,
      channel: channel,
    });
  };
  this.addMessageAction = (channel, messageToken, reactionText) => {
    pubnub.addMessageAction({
      channel: channel,
      messageTimetoken: messageToken,
      action: {
        type: "reaction",
        value: reactionText,
      },

      function(status, response) {
        console.log(status, response);
      },
    });
  };

  this.getMessageActions = () => {
    pubnub.getMessageActions(
      {
        channel: "CHANNEL2",
        limit: 100,
      },
      function (status, response) {
        console.log(status, response);
      }
    );
  };

  this.sendFile = async (file) => {
    const result = await pubnub.sendFile({
      channel: FILECHANNEL,
      message: {
        test: "message",
        value: 42,
      },
      file: file,
    });
  };

  this.getFile = (channel, id, name) => {
    const result = pubnub.getFileUrl({
      channel: channel,
      id: id,
      name: name,
    });
    return result;
  };
}

export const pubsub = new PubSub();

export const MessagesState = (props) => {
  const initialState = {
    messages: [],
    prevChannel1Messages: null,
    prevChannel2Messages: null,
    prevChannel3Messages: null,
    prevChannel1Actions: null,
    imageFilesList: null,
    username: "anonymous",
    reactionsMap: {},
    pubsub: pubsub,
  };

  const [state, dispatch] = useReducer(MessagesReducer, initialState);

  const newMessage = (obj) => {
    console.log(obj);
    dispatch({
      type: NEW_MESSAGE,
      item: obj,
    });
  };

  const newAction = (obj) => {
    console.log(obj);
    dispatch({
      type: CHANNEL1_NEW_MESSAGE_ACTION,
      item: obj,
    });
  };

  const newImageFile = (obj) => {
    console.log(obj.file);
    let urlsArr = {};

    let imgVal = pubnub.getFileUrl({
      channel: "FILECHANNEL",
      id: obj.file.id,
      name: obj.file.name,
    });
    console.log(imgVal);
    let messageVal = obj.message;
    console.log(messageVal);

    // urlsArr.push({ imgVal, messageVal, timetoken: obj.timetoken });

    dispatch({
      type: NEW_IMAGE_FILE,
      item: {
        channel: obj.channel,
        imgVal,
        messageVal,
        timetoken: obj.timetoken,
      },
    });
    console.log(urlsArr);
  };

  const getMessages = (channel) => {
    pubnub
      .fetchMessages({
        channels: [channel],

        count: 75, // default/max is 25
      })
      .then(async (res) => {
        console.log(res);
        if (channel === "CHANNEL1") {
          dispatch({
            type: GET_CHANNEL1_MESSAGES,
            item: res.channels.CHANNEL1,
          });
        } else if (channel === "CHANNEL2") {
          dispatch({
            type: GET_CHANNEL2_MESSAGES,
            item: res.channels.CHANNEL2,
          });
        } else if (channel === "CHANNEL3") {
          dispatch({
            type: GET_CHANNEL3_MESSAGES,
            item: res.channels.CHANNEL3,
          });
        }
      });
  };

  const getActions = (channel) => {
    pubnub
      .getMessageActions({
        channel: channel,
        limit: 100,
      })
      .then(async (res) => {
        console.log(res);
        if (channel === "CHANNEL1") {
          dispatch({
            type: GET_CHANNEL1_ACTIONS,
            item: res.data,
          });
        }
      });
  };

  const getImageFiles = async (channel) => {
    const imagefiles = await pubnub.fetchMessages({
      channels: [FILECHANNEL],

      count: 175, // default/max is 25
    });

    console.log(imagefiles);

    let urlsArr = [];

    await imagefiles.channels.FILECHANNEL.forEach((element) => {
      console.log(element);
      let imgVal = pubnub.getFileUrl({
        channel: "FILECHANNEL",
        id: element.message.file.id,
        name: element.message.file.name,
      });

      let messageVal = element.message.message;

      urlsArr.push({ imgVal, messageVal, timetoken: element.timetoken });
    });

    await dispatch({
      type: GET_IMAGE_FILES,
      item: urlsArr,
    });
    console.log(urlsArr);
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
        imageFilesList: state.imageFilesList,
        prevChannel1Actions: state.prevChannel1Actions,
        pubsub: state.pubsub,
        newMessage,
        prevChannel1Messages: state.prevChannel1Messages,
        prevChannel2Messages: state.prevChannel2Messages,
        prevChannel3Messages: state.prevChannel3Messages,
        getImageFiles,
        setUsername,
        createReaction,
        getMessages,
        newImageFile,
        getActions,
        newAction,
      }}
    >
      {props.children}
    </MessagesContext.Provider>
  );
};

//export default MessagesState;
