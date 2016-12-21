// we import all the various reducers we created, to be combined using the Redux function `combineReducers()`
import { combineReducers } from 'redux';
import sideMenuReducer from './sideMenuReducer'
import authReducer from './authReducer'

// pass in an object to combineReducers() that represents a mapping of each reducers
// inside <SideMenu> (ie ../components/SideMenu/SideMenu.js) we can reference the `visible` attribute with `state.sideMenu.visible`
// inside <Home> (ie ../components/home.js) we can reference the `myContent` attribute with `state.content.myContent`
const rootReducer = combineReducers({
  sideMenu: sideMenuReducer,
  auth: authReducer
})

// export the combined reducers for use inside `../store.js` to create the Redux store (aka the Redux state)
export default rootReducer
