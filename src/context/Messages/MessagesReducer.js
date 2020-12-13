import {
  NEW_MESSAGE,
  SET_USERNAME,
  REACTION_OBJECTS,
  GET_MESSAGES,
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
    case GET_MESSAGES:
      return {
        ...state,
        prevMessages: action.item,
      };
    case NEW_MESSAGE:
      return { ...state, prevMessages: [...state.prevMessages, action.item] };
    case SET_USERNAME:
      return { ...state, username: action.username };
    default:
      return state;
  }
};
