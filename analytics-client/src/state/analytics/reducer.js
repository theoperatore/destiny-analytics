const DEFAULT_ANALYTICS = {
  characterData: [],
  isLoadingCharacterData: false,
  characterDataLoadError: null,
};

export function analytics(state = DEFAULT_ANALYTICS, action) {
  switch (action.type) {
    case 'loadCharacterData': {
      return {
        ...state,
        isLoadingCharacterData: true,
        characterDataLoadError: null,
      }
    }
    case 'errorLoadingCharacterData': {
      return {
        ...state,
        isLoadingCharacterData: false,
        characterDataLoadError: action.error,
      }
    }
    case 'receiveCharacterData': {
      return {
        ...state,
        characterData: action.characterData,
        isLoadingCharacterData: false,
        characterDataLoadError: null,
      }
    }
    default:
      return state;
  }
}