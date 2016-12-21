import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Store from './store'
import App from './components/app'
import Home from './components/home'
import Login from './components/Auth/Login'
import SignUp from './components/Auth/SignUp'
import SignOut from './components/Auth/SignOut'
import VerifyAccount from './components/Auth/VerifyAccount'
import ResetPassword from './components/Auth/ResetPassword'
import AuthenticatedPage from './components/Auth/AuthenticatedPage'
import RequireAuth from './components/Auth/require_auth_HOC'

// This is a component tree that will be injected into index.html <div class='container'></div>
// The <Provider store={Store}> component is one provided by Redux. The `Store` is imported from `./store.js`
// The <Router> component is one provided by React-Router
      // browserHistory manages url routing (react-router)
      // <Route path='/'> creates a url with '/' appended. eg 'www.mywebsite.com/'
      // <IndexRoute component={Home}> sets <Home> as the default component for display
      // <Route path='about' component={About}> sets <About> as the component for display when the url is 'www.mywebsite.com/about'
      // If we add another <Route path='123'> nested inside <Route path='about' component={About}>, the url is 'www.mywebsite.com/about/123'
ReactDOM.render(
  <Provider store={Store}>
  	<Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Home} />
        <Route path='auth'>
          <Route path='login' component={Login}></Route>
          <Route path='signup' component={SignUp}></Route>
          <Route path='signout' component={SignOut}></Route>
          <Route path='verify_account' component={VerifyAccount}></Route>
          <Route path='forgot_password' component={ResetPassword}></Route>
          <Route path='authenticated_page' component={RequireAuth(AuthenticatedPage)}></Route>
        </Route>
      </Route>
  	</Router>
  </Provider>
  , document.querySelector('.container'))       // we select the html div with class 'container' to inject our component tree into
