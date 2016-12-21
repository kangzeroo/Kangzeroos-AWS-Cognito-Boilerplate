import axios from 'axios';
import {browserHistory} from 'react-router';
import { AUTH_USER, UNAUTH_USER, SET_USER } from './action_types';
import { API_URL } from '../api/API_URLS'

export function logoutUserFromReduxState(){
	return function(dispatch){
		dispatch({
			type: UNAUTH_USER
		})
	}
}

export function setUser(user){
	return function(dispatch){
		dispatch({
			type: AUTH_USER
		})
		dispatch({
			type: SET_USER,
			payload: user
		})
	}
}

export function setUserToReduxState(user){
	return function(dispatch){
		dispatch({
			type: AUTH_USER
		})
		dispatch({
			type: SET_USER,
			payload: user
		})
		// redirect to route
		browserHistory.push('/auth/authenticated_page');
	}
}
