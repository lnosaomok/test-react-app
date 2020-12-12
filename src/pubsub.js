import PubNub from "pubnub";
import pubnubConfig from "./pubnub.config";
import { useState } from "react";

export const MESSAGE_CHANNEL = "MESSAGE_CHANNEL";

function PubSub() {
  const pubnub = new PubNub(pubnubConfig);
  const [messages, setMessages] = useState(null);
  var self = this;
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

  this.fetchMessages = () => {
    let resp = {};
    pubnub
      .fetchMessages({
        channels: [MESSAGE_CHANNEL],

        count: 25, // default/max is 25
      })
      .then(async (res) => {
        resp = res;
        console.log(resp);
      });

    return messages;
  };
}

export default PubSub;
