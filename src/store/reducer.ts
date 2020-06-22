import { ADDED_FONT, CHANGED_TEXT, CHANGED_FONT, initialState } from './actions'

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
    default:
      return state
  }
}
