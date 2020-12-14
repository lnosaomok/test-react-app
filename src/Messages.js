import React from "react";
import { useEffect, useContext, useState } from "react";
import MessagesContext from "../src/context/Messages/MessagesContext";
import MessageItem from "./MessageItem";
const Messages = () => {
  const messagesContext = useContext(MessagesContext);
  const {
    pubsub: {
      fetchMessages,
      publish,
      sendFile,
      addListener,
      addMessageAction,
      getMessageActions,
      getFile,
    },
    pubsub,
    newMessage,
    messages,
    getImageFiles,
    imageFilesList,
    prevChannel1Actions,
    prevChannel1Messages,
    prevChannel2Messages,
    prevChannel3Messages,
    getMessages,
    newAction,
    newImageFile,
    getActions,
  } = messagesContext;
  const [messagesArr, setMessagesArr] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrls, setFileUrls] = useState([]);

  useEffect(() => {
    pubsub.addListener({
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
      messageAction: (messageObject) => {
        // handle message action
        console.log("ReceivedACTION", messageObject);
        const { actionTimetoken, messageTimetoken, value } = messageObject.data;
        const val = { actionTimetoken, messageTimetoken, value };
        newAction(val);

        // var channelName = ma.channel; // The channel to which the message was published
        // var publisher = ma.publisher; //The Publisher
        // var event = ma.message.event; // message action added or removed
        // var type = ma.message.data.type; // message action type
        // var value = ma.message.data.value; // message action value
        // var messageTimetoken = ma.message.data.messageTimetoken; // The timetoken of the original message
        // var actionTimetoken = ma.message.data.actionTimetoken; // The timetoken of the message action
      },

      file: (messageObject) => {
        // handle message action
        // console.log("ReceivedFile", messageObject);
        let messageAndFile = {};
        messageAndFile.message = messageObject.message;
        messageAndFile.file = messageObject.file;
        messageAndFile.channel = messageObject.channel;
        messageAndFile.timetoken = messageObject.timetoken;
        /// console.log(message.message);

        newImageFile(messageAndFile);
        console.log("sent mess");

        // var channelName = ma.channel; // The channel to which the message was published
        // var publisher = ma.publisher; //The Publisher
        // var event = ma.message.event; // message action added or removed
        // var type = ma.message.data.type; // message action type
        // var value = ma.message.data.value; // message action value
        // var messageTimetoken = ma.message.data.messageTimetoken; // The timetoken of the original message
        // var actionTimetoken = ma.message.data.actionTimetoken; // The timetoken of the message action
      },
    });
  }, []);

  const onChangeFile = (e) => {
    const files = e.target.files;
    if (files.length === 0) {
      console.log("No file is selected");
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      setFile(files[0]);
      // console.log("File content:", e.target.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const onChange = (e) => {
    setMessagesArr(e.target.value);
  };
  const publishMessage = (channel) => {
    // console.log(newMessage({ text, username }));
    publish(
      {
        item: {
          id: "b0290cf0-0cf7-4357-8ba6-2448e445c146",
          text: messagesArr,
          timestamp: 160774360691909,
          username: "anonymoudtyyyts",
        },

        type: "NEW_MESSAGE",
      },
      channel
    );
  };
  const addReaction = () => {
    addMessageAction();
  };

  const getMessageReactions = () => {
    getMessageActions();
  };

  const sendUserFile = (file) => {
    sendFile(file);
  };

  useEffect(() => {
    getMessages("CHANNEL1");
    getMessages("CHANNEL2");
    getMessages("CHANNEL3");
    getImageFiles("FILECHANNEL");
    getActions("CHANNEL1");
  }, []);
  console.log(prevChannel1Messages);
  console.log(prevChannel2Messages);
  console.log(prevChannel3Messages);
  console.log(imageFilesList);
  console.log(prevChannel1Actions);

  //const { data } = imageFilesList;

  console.log(file);

  return (
    <div>
      <input
        type='text'
        value={messagesArr}
        onChange={(e) => {
          onChange(e);
        }}
      />
      <input
        type='submit'
        value='submit'
        onClick={() => {
          publishMessage("CHANNEL1");
        }}
      />
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

      <h1>File Upload</h1>
      <input
        type='file'
        onChange={(e) => {
          onChangeFile(e);
        }}
      />
      <button
        type='submit'
        onClick={(e) => {
          sendUserFile(file);
          console.log(file);
        }}
      >
        Upload
      </button>
      {file ? (
        <div>
          <img src={file} alt='preview' />
        </div>
      ) : (
        <span>No file selected</span>
      )}
      {/* {imageFilesList &&
        imageFilesList.map((obj) => {
          return <img src={obj.imgVal} alt='preview' />;
        })} */}

      {prevChannel1Messages !== null && prevChannel1Messages.length > 0 ? (
        prevChannel1Messages
          .filter((message) => {
            return message.message.item.text;
          })
          .map((message) => {
            return (
              <MessageItem message={message} actions={prevChannel1Actions} />
            );
          })
      ) : (
        <p>No messages</p>
      )}
    </div>
  );
};

export default Messages;
