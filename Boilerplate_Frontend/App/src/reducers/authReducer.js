import { AUTH_USER, UNAUTH_USER, SET_USER } from '../actions/action_types'

const INITIAL_STATE = {
  authenticated: false,
	user: null
}

export default function(state = INITIAL_STATE, action){
	switch(action.type){
		case AUTH_USER:
			return {
				...state,
				authenticated: true
			}
    case UNAUTH_USER:
      return {
        ...state,
        authenticated: false,
        user: null
      }
    case SET_USER:
      return {
        ...state,
        user: action.payload
      }
	}
	return state
}
