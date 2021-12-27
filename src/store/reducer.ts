import {
  ADDED_FONT,
  REFRESHED_FONT,
  CHANGED_TEXT,
  CHANGED_FONT,
  CHANGED_DRAWER_STATE,
  CHANGED_DIRECTION,
  CHANGED_SCRIPT,
  CHANGED_LANGUAGE,
  CHANGED_FEATURE_STATE,
  CHANGED_FEATURE_STRING,
  CHANGED_CLUSTER_LEVEL,
  CHANGED_BUFFER_FLAG,
  CHANGED_SHOW_ALL_LOOKUPS,
  initialState,
} from "./actions";

export default function appReducer(state = initialState, action: any) {
  const features = { ...state.features };
  switch (action.type) {
    case CHANGED_FONT:
      return { ...state, selected_font: action.selected_font };
    case CHANGED_TEXT:
      return { ...state, inputtext: action.inputtext };
    case CHANGED_CLUSTER_LEVEL:
      return { ...state, clusterLevel: action.clusterLevel };
    case CHANGED_BUFFER_FLAG:
      return { ...state, bufferFlag: action.bufferFlag };
    case CHANGED_DIRECTION:
      return { ...state, direction: action.direction };
    case CHANGED_SCRIPT:
      return { ...state, script: action.script };
    case CHANGED_LANGUAGE:
      return { ...state, language: action.language };
    case CHANGED_DRAWER_STATE:
      return { ...state, drawerOpen: action.open };
    case CHANGED_SHOW_ALL_LOOKUPS:
      return { ...state, showAllLookups: action.showAllLookups };
    case ADDED_FONT:
      return {
        ...state,
        fonts: [...state.fonts, action.added_font],
        selected_font: state.fonts.length,
      };
    case REFRESHED_FONT:
      return {
        ...state,
        fonts: [...state.fonts.slice(0, -1), action.added_font],
      };
    case CHANGED_FEATURE_STRING:
      return { ...state, featureString: action.featureString };
    case CHANGED_FEATURE_STATE:
      if (!(action.feature in features)) {
        features[action.feature] = true;
      } else if (features[action.feature]) {
        features[action.feature] = false;
      } else {
        delete features[action.feature];
      }
      return { ...state, features };

    default:
      return state;
  }
}
