// We import TOGGLE_SIDEMENU for use inside this reducer
import { TOGGLE_SIDEMENU } from '../actions/action_types'

// We can define the initial state of this Redux reducer
const INITIAL_STATE = {
	// `visible` is a boolean attribute
	// `visible` is used by <SideMenu> (ie ../components/SideMenu/SideMenu.js) to determine whether the sidemenu is visible or not
	visible: false
}

// The Redux reducer is simply a function that takes 2 attributes: (state, action)
export default function(state = INITIAL_STATE, action){
	// This switch statement checks the incoming action for the `type` attribute
	switch(action.type){
		// If `action.type == TOGGLE_SIDEMENU`, then..
		case TOGGLE_SIDEMENU:
			// return all the attributes of state (using ES6 object deconstructors `...state`)
			return {
				...state,
				// and overwrite the `visible` attribute with its opposite value (ie false --> true and vice versa)
				visible: !state.visible
			}
	}
	// for all uncaught `action.type`, just return the state
	return state
}

// This Redux reducer is exported for use in `./index.js`, to be combined with other reducers to form a giant combined reducer
// See `./index.js` for more details
