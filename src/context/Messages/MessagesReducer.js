import {
  NEW_MESSAGE,
  SET_USERNAME,
  REACTION_OBJECTS,
  GET_CHANNEL1_MESSAGES,
  GET_CHANNEL2_MESSAGES,
  GET_CHANNEL3_MESSAGES,
  GET_CHANNEL1_ACTIONS,
  CHANNEL1_NEW_MESSAGE_ACTION,
  NEW_IMAGE_FILE,
  GET_IMAGE_FILES,
} from "../types";
const REACTION_TYPES = REACTION_OBJECTS.map(
  (REACTION_OBJECT) => REACTION_OBJECT.type
);
export default (state, action) => {
  if (REACTION_TYPES.includes(action.type)) {
    let reactionsMap;
    const { messageId } = action.item;
    const messageReactions = state.reactionsMap[messageId];

    if (messageReactions) {
      reactionsMap = {
        ...state.reactionsMap,
        [messageId]: [...messageReactions, action.item],
      };
    } else {
      reactionsMap = {
        ...state.reactionsMap,
        [messageId]: [action.item],
      };
    }

    return { ...state, reactionsMap };
  }

  switch (action.type) {
    case GET_CHANNEL1_MESSAGES:
      return {
        ...state,
        prevChannel1Messages: action.item,
      };

    case GET_CHANNEL2_MESSAGES:
      return {
        ...state,
        prevChannel2Messages: action.item,
      };
    case GET_CHANNEL3_MESSAGES:
      return {
        ...state,
        prevChannel3Messages: action.item,
      };
    case GET_IMAGE_FILES:
      return {
        ...state,
        imageFilesList: action.item,
      };

    case GET_CHANNEL1_ACTIONS:
      return {
        ...state,
        prevChannel1Actions: action.item,
      };

    case NEW_MESSAGE:
      return {
        ...state,
        prevChannel1Messages: [...state.prevChannel1Messages, action.item],
      };

    case CHANNEL1_NEW_MESSAGE_ACTION:
      return {
        ...state,
        prevChannel1Actions: [...state.prevChannel1Actions, action.item],
      };

    case NEW_IMAGE_FILE:
      return {
        ...state,
        imageFilesList: [...state.imageFilesList, action.item],
      };
    case SET_USERNAME:
      return { ...state, username: action.username };
    default:
      return state;
  }
};
