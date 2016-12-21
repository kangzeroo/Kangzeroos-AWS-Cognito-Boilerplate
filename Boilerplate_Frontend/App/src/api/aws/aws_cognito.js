// AWS Cognito for authenticating user
// https://github.com/aws/amazon-cognito-identity-js

import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoIdentityCredentials, WebIdentityCredentials } from 'amazon-cognito-identity-js';
import { userPool, USERPOOL_ID, IDENTITY_POOL_ID } from './aws_profile'
import uuid from 'node-uuid'

// https://github.com/aws/amazon-cognito-js/
// entire cognito sync
import 'amazon-cognito-js'

// we create an array of all attributes, without the `custom:` prefix.
// This will be used for building the React-Redux object in plain JS, hence no AWS Cognito related name requirements
const landlordAttrs = ["email", "agentName", "id"]
// we create an array of all our desired attributes for changing, and we loop through this array to access the key name.
// This will be used for AWS Cognito related name requirements
const attrs = ["custom:agentName"]



// sign up user with the 3 paramesters we require (AWS itself only requires 2: email and password)
export function signUpUser({email, agentName, password}){
	// instantiate a promise so we can work with this async easily
	const p = new Promise((res, rej)=>{
		// create an array of attributes that we want
		const attributeList = []
		// create the attribute objects in plain JS for each parameter we want to save publically (aka NOT the password)
		const dataEmail = {
		    Name : 'email',
		    Value : email
		}
		const dataAgentName = {
		    Name : 'custom:agentName',
		    Value : agentName
		}
		// take each attribute object and turn it into a CognitoUserAttribute object
		const attributeEmail = new CognitoUserAttribute(dataEmail)
		const attributeAgentName = new CognitoUserAttribute(dataAgentName)
		// add each CognitoUserAttribute to the attributeList array
		attributeList.push(attributeEmail, attributeAgentName)
		// call the signUp method of our userPool, passing in email+password as the first 2 args (the two that AWS requires)
		// and as the 3rd arg pass in the attributeList array, followed by `null` as the 4th arg
		// finally as the 5th (last) arg, pass in the callback function that has the error or result from AWS
		userPool.signUp(email, password, attributeList, null, function(err, result){
		    if (err) {
		        rej(err)
		    }
				// resolve the promise with whatever attributes you need
				// in this case, we return an object with only the email attribute because we will save that to localStorage
		    res({email})
		})
	})
	return p
}

// sign in user with 2 parameters (email and password)
export function signInUser({email, password}){
	// use a promise to handle async
	const p = new Promise((res, rej)=>{
		// create an `AuthenticationDetails` Cognito object filled with the email+password
		const authenticationDetails = new AuthenticationDetails({
			Username: email,
			Password: password
		})
		// create a `CognitoUser` object filled with a username and identity pool
		const userData = {
			Username: email,
			Pool: userPool
		}
		const cognitoUser = new CognitoUser(userData)
		// call the `authenticateUser` method from Cognito, passing in the `CognitoUser` object and the `AuthenticationDetails` object
		authenticateUser(cognitoUser, authenticationDetails)
			.then(()=>{
				// if successfully authenticated, build the user object to return to the Redux state to use
				return buildUserObject(cognitoUser)
			})
			.then((userProfileObject)=>{
				// if successfully built the object, return it back to your React app
				res(userProfileObject)
			})
			.catch((err)=>{
				// if failure, reject the promise
				rej(err)
			})
	})
	return p
}

// authenticate a user with its `CognitoUser` and `AuthenticationDetails` AWS objects
function authenticateUser(cognitoUser, authenticationDetails){
	// use a promise to handle async
	const p = new Promise((res, rej)=>{
		// call the `authenticateUser` method of the `CognitoUser` object, passing in the `AuthenticationDetails`
		cognitoUser.authenticateUser(authenticationDetails, {
					// handle if successfull
	        onSuccess: function (result) {
							// save the jwtToken on localStorage for access elsewhere in app
	            localStorage.setItem('user_token', result.accessToken.jwtToken);
	            console.log("======== VIEW THE REFRESH TOKEN =========")
	            console.log(localStorage.getItem('user_token'))
	            console.log("======== VIEW THE AUTHENICATION RESULT =========")
	            console.log(result)

							// To
			    		// Edge case, AWS Cognito does not allow for the Logins attr to be dynamically generated. So we must create the loginsObj beforehand
	            const loginsObj = {
	                // For the object's key name, use the USERPOOL_ID taken from our shared aws_profile js file
									// For the object's value, use the jwtToken received in the success callback
	                [USERPOOL_ID]: result.getIdToken().getJwtToken()
	            }
							// in order to use other AWS services (such as S3), we need the correct AWS credentials
							// we set these credentials by passing in a `CognitoIdentityCredentials` object that has our identity pool id and logins object
							// we are logging into an AWS federated identify pool
							AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	                IdentityPoolId : IDENTITY_POOL_ID, // your identity pool id here
	                Logins : loginsObj
	            })
							// then we refresh our credentials to use the latest one that we set
	            AWS.config.credentials.refresh(function(){
	            	console.log(AWS.config.credentials)
	            })
							// resolve the promise to move on to next step after authentication
	            res()
	        },
					// if there was a failure, we reject the promise
	        onFailure: function(err) {
	            console.log(err)
	            rej(err)
	        },
	    })
	})
	return p
}

// buildUserObject() gets the user attributes from Cognito and creates an object to represent our user
// this will be used by the Redux state so that we can reference the user
function buildUserObject(cognitoUser){
	const p = new Promise((res, rej)=>{
		// call the cognito function `getUserAttributes()`
		cognitoUser.getUserAttributes(function(err, result) {
	        if (err) {
	            console.log(err);
	    				rej(err)
	        }
					// instantiate an empty object
	        let userProfileObject = {}
					// loop through the userAttributes and append to `userProfileObject` as attributes
					for (let i = 0; i < result.length; i++) {
						// custom Cognito attributes will be prefixed with `custom:`, so we must strip away that from the string
		        if(result[i].getName().indexOf('custom:') >= 0){
		    		let name = result[i].getName().slice(7, result[i].getName().length)
		    		userProfileObject[name] = result[i].getValue()
		    	}else{
						// normal Cognito attributes will not be prefixed with `custom:` so we can use use the string immediately
		    		userProfileObject[result[i].getName()] = result[i].getValue()
		    	}
		    }
	      // and now our user profile object is complete and we resolve the promise to move on to the next step
	      res(userProfileObject)
	    })
	})
	return p
}

// when users sign up, they need to verify their account
// verification requires their unique identifier (in this case, their email) and the verification PIN
export function verifyUserAccount({email, pin}){
	const p = new Promise((res, rej)=>{
		// we create an object to hold our userData that will be used to create our `cognitoUser` object
		// we cannot just use `userPool` to instantiate a `cognitoUser` object, as no user has been signed in yet
		const userData = {
			Username: email,
			Pool: userPool
		}
		// create the `cognitoUser` object
		const cognitoUser = new CognitoUser(userData)
		// call the `confirmRegistration()` function of `cognitoUser` and pass in the verification PIN
		cognitoUser.confirmRegistration(pin, true, function(err, result) {
	        if (err) {
	            console.log(err);
		        rej(err)
	            return;
	        }
	        // if successful, we signout to refresh the cognitoUser (they will have to login again)
					// actually this is not mandatory either, but during testing I discovered that login does not immediately work after verification due to un-refreshed authentication
					// logging in again will get those authentication tokens
	        if(result == "SUCCESS"){
	        	console.log("Successfully verified account!")
	        	cognitoUser.signOut()
	        	res()
	        }else{
						// if otherwise failure, we reject the promise
	        	rej("Could not verify account")
	        }
	    })
	})
	return p
}

// if we want to update the info of our user, we must pass in their unique identifier (email) and an object representing the user info
export function updateUserInfo(email, editedInfo){
	console.log(editedInfo)
	const p = new Promise((res, rej)=>{
		// we create an array for our attributes that we want to update, and push all `CognitoUserAttribute` objects into it
		const attributeList = []
		// loop through the `attrs` array to create our `CognitoUserAttribute` objects
		for(let a = 0; a<attrs.length; a++){
			if(editedInfo[attrs[a]]){
				console.log(editedInfo[attrs[a]])
				// using the attr[position] to get our key name, we can find the value via editedInfo[attr[position]]
				let attribute = {
		        Name : attrs[a],
		        Value : editedInfo[attrs[a]]
		    }
				// convert into `CognitoUserAttribute` object
		    let x = new CognitoUserAttribute(attribute)
				// add it to the `attributeList` array
		    attributeList.push(x)
			}
		}
		console.log(attributeList)
		// instantiate the `cognitoUser` from our userPool (we can do this because the user is already signed in if they are attempting to change their attributes)
    const cognitoUser = userPool.getCurrentUser()
		// get the latest cognito session so that we can `updateAttributes()`
    cognitoUser.getSession(function(err, result) {
        if (result) {
					// if we successfully got the latest session, we can `updateAttributes()` from 'cognitoUser', passing in the `attributeList` array
          cognitoUser.updateAttributes(attributeList, function(err, result) {
						// reject promise if the update attempt failed
		        if (err) {
		            console.log(err);
	        			rej(err)
		            return;
		        }
						// we user `setTimeout()` to give AWS some time to update the user properties
		        setTimeout(()=>{
							// then we get the latest user attributes
			        cognitoUser.getUserAttributes(function(err, result) {
								// reject promise if failed
				        if (err) {
				            console.log(err);
	        					rej(err)
				            return;
				        }
								// if success, then `buildUserObject()` again and resolve the promise with `userProfileObject`
 				        buildUserObject(cognitoUser)
				        	.then((userProfileObject)=>{
				        		res(userProfileObject)
				        	})
				    	})
		        }, 500)
		    });
      }
    });
	})
	return p
}

// if a user forgets a password, we can instantiate the password reset process (requiring an email)
export function forgotPassword(email){
	const p = new Promise((res, rej)=>{
		// we create the `userData` object to create a `cognitoUser`
 		const userData = {
			Username: email,
			Pool: userPool
		}
		// we must create a new `cognitoUser` instead of using `userPool` since no user is currently logged in
		const cognitoUser = new CognitoUser(userData)

		// call the `forgotPassword()` function of `cognitoUser`
		cognitoUser.forgotPassword({

					// we are resolving the `cognitoUser` in our promise because the React component will use it to call `cognitoUser.confirmPassword()`
					// thats also why we pass in the `forgotPassword` `this` to be used in the React component

					// if successful, then we can resolve the promise with cognitoUser and the `this` declaration from the React component that calls `forgotPassword()`
					// but we may also resolve the promise with the third function `inputVerificationCode()` which handles behind the scenes of `forgotPassword()`
	        onSuccess: function (result) {
	            console.log('call result: ' + result);
							// res({
							// 	cognitoUser: cognitoUser,
							//	thirdArg: this
							// })
	        },
					// if failure, reject the promise
	        onFailure: function(err) {
		        rej(err)
	        },
	        // Optional automatic callback that passes in `data` object from `forgotPassword()` and resolve the same was as `onSuccess`
					// `inputVerificationCode()` handles behind the scenes of `forgotPassword()`, but we don't actually use it. Its here if needed in the future.
	        inputVerificationCode: function(data) {
	            //console.log('Code sent to: ' + data)
	            res({
	            	cognitoUser: cognitoUser,
	            	thirdArg: this
	            })
	        }
	    })
	})
	return p
}

// reset the verification PIN for verifying a new user
export function resetVerificationPIN(email){
	const p = new Promise((res, rej)=>{
		// create the `userData` object for instantiating a new `cognitoUser` object
		const userData = {
			Username: email,
			Pool: userPool
		}
		// create the `cognitoUser` object
		const cognitoUser = new CognitoUser(userData)
		// and call the `resendConfirmationCode()` of `cognitoUser`
		cognitoUser.resendConfirmationCode(function(err, result) {
					// reject promise if confirmation code failed
	        if (err) {
	          console.log(err);
		        rej(err)
	        }
					// resolve if successfull
	        res()
	    })
	})
	return p
}

// for automatic signin of a user (so they don't have to login each time)
export function retrieveUserFromLocalStorage(){
	const p = new Promise((res, rej)=>{
			// grab the `cognitoUser` object from `userPool`
			// this is possible without login because we had already logged in before (whereas verifyPIN and resetPassword have not)
	    const cognitoUser = userPool.getCurrentUser();
	    console.log("Getting cognitoUser from local storage...")
	    if (cognitoUser != null) {
					// get the latest session from `cognitoUser`
	        cognitoUser.getSession(function(err, session) {
							// if failed to get session, reject the promise
	            if (err) {
	                rej(err)
	            }
							// check that the session is valid
	            console.log('session validity: ' + session.isValid());
	            console.log(session);
							// save to localStorage the jwtToken from the `session`
	            localStorage.setItem('user_token', session.getAccessToken().getJwtToken());
	            // Edge case, AWS Cognito does not allow for the Logins attr to be dynamically generated. So we must create the loginsObj beforehand
	            const loginsObj = {
	                // our loginsObj will just use the jwtToken to verify our user
	                [USERPOOL_ID] : session.getIdToken().getJwtToken()
	            }
							// create a new `CognitoIdentityCredentials` object to set our credentials
							// we are logging into a AWS federated identity pool
			    		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	                IdentityPoolId : IDENTITY_POOL_ID, // your identity pool id here
	                Logins : loginsObj
	            })
							// refresh the credentials so we can use it in our app
	            AWS.config.credentials.refresh(function(){
	            	console.log(AWS.config.credentials)
								// resolve the promise by again building the user object to be used in our React-Redux app
	            	res(buildUserObject(cognitoUser))
	            })
	        });
	    }else{
				// if failure, reject the promise
	    	rej('Failed to retrieve user from localStorage')
	    }
	})
	return p
}

// signout the current user
export function signOutUser(){
	const p = new Promise((res, rej)=>{
		// since the user is already logged in, we can instantiate `cognitoUser` with `userPool`
		const cognitoUser = userPool.getCurrentUser()
		cognitoUser.signOut()
	})
	return p
}

// login to cognito using Facebook instead of an AWS email/password login flow
// requires first logging in with Facebook and passing in the result of the login function to `registerFacebookLoginWithCognito()`
export function registerFacebookLoginWithCognito(response){
	console.log("registerFacebookLoginWithCognito")
	console.log(response)
	// Check if the user logged in successfully.
	  if (response.authResponse) {

	    console.log('You are now logged in.');

	    // Add the Facebook access token to the Cognito credentials login map
			// we pass in the accessToken from the fb response into our `CognitoIdentityCredentials`
	    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
				// we are logging into an AWS federated identify pool, for facebook login
	      IdentityPoolId: IDENTITY_POOL_ID,
	      Logins: {
	         'graph.facebook.com': response.authResponse.accessToken
	      }
	    })

	    // AWS Cognito Sync to sync Facebook
			// aka refreshing the credentials to use thorughout our app
	    AWS.config.credentials.get(function() {
		    const client = new AWS.CognitoSyncManager();
		    console.log(AWS.config.credentials)
		});

	  } else {
	    console.log('There was a problem logging you in.');
	  }
}
