// sideMenuActions.js holds all the "action creators" related to the side menu
// "action creators" are functions that use `dispatch()`, a function provided by Redux, to send actions to Redux reducers
// The Redux reducers will use actions to determine how they will calculate the next Redux state

// We import TOGGLE_SIDEMENU from `./action_types` for use inside these action creators
import { TOGGLE_SIDEMENU } from './action_types'

// This action creator will be exported for use in <SideMenu> and other components
// When `toggleSideMenu()` is called, the TOGGLE_SIDEMENU action is dispatched to Redux reducers
// we can optionally add a `payload` attribute to the object we are passing into `dispatch()`
          // `payload` should contain a plain javascript object (or string, number, boolean)
          // checkout './contentActions.js' to see an example using `payload`

// Checkout `../reducers/sideMenuReducer.js` to see how the reducer handles TOGGLE_SIDEMENU
export function toggleSideMenu(){
  return function(dispatch){
    dispatch({
      type: TOGGLE_SIDEMENU,
      // payload: {}
    })
  }
}
