import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers';
import createLogger from 'redux-logger';

// store.js represents the overall Redux state
// store.js is exported for use inside ./index.js (ie. <Provider store={Store}>)
				// all child components of <Provider> will have access to the Redux store (aka Redux state)

// recall that all actions will flow through each middleware until it reaches the end to be passed to Redux reducers
// applyMiddleware() is used to combine various middlewares
const createStoreWithMiddleware = applyMiddleware(
		// reduxThunk allows us to store functions inside our actions (instead of only objects). Without reduxThunk we could only use very simple actions
	  reduxThunk,
		// createLogger() is an optional (very useful) tool for visualizing Redux state changes in the browser console
  	createLogger()
)(createStore)

// create an instance of the redux store with all our reducers
// we pass in an entire folder of reducers via ./reducers, or ./reducers/index.js which is our combined reducers
const store = createStoreWithMiddleware(
  reducers
);

// and finally export the store for external use
export default store;
