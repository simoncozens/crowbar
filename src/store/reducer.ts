import { ADDED_FONT,
  CHANGED_TEXT,
  CHANGED_FONT,
  CHANGED_DRAWER_STATE,
  CHANGED_FEATURE_STATE,
  CHANGED_CLUSTER_LEVEL,
  initialState } from './actions'

export default function appReducer(state = initialState, action: any) {
  switch (action.type) {
    case CHANGED_FONT:
      return Object.assign({}, state, {
        selected_font: action.selected_font
      })
    case CHANGED_TEXT:
      return Object.assign({}, state, {
        inputtext: action.inputtext
      })
    case CHANGED_CLUSTER_LEVEL:
      return Object.assign({}, state, {
        clusterLevel: action.clusterLevel
      })
    case CHANGED_DRAWER_STATE:
      console.log("Changed drawer state",action.open)
      return Object.assign({}, state, {
        drawerOpen: action.open
      })
    case ADDED_FONT:
      return Object.assign({}, state, {
        fonts: [...state.fonts, action.added_font],
        selected_font: state.fonts.length
      })
    case CHANGED_FEATURE_STATE:
      var features = {...state.features};
      if (!(action.feature in features)) {
        features[action.feature] = true;
      } else if (features[action.feature]) {
        features[action.feature] = false;
      } else {
        delete features[action.feature];
      }
      return Object.assign({}, state, {
        features: features
      })

    default:
      return state
  }
}
