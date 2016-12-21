import React, {Component} from 'react';
import { connect } from 'react-redux';
import Radium from 'radium'
import { browserHistory } from 'react-router'
import { xMidBlue } from '../../stylesJS/base_colors'

import {signUpUser} from '../../api/aws/aws_cognito'


class SignUp extends Component {

	constructor(){
		super()
		this.state = {
			email: "",
			agentName: "",
			password: "",
			confirmPassword: "",
			errorMessage: null,
			loading: false
		}
	}

	handleChange(attr, event){
		this.setState({
			[attr]: event.target.value
		})
	}

	renderAlert(){
		if(this.state.errorMessage){
			return (
				<div className='alert alert-danger' style={comStyles().errorMessage}>
					<strong>Oops!</strong> {this.state.errorMessage}
					<b onClick={()=>this.setState({errorMessage: ""})} style={comStyles().messageClose}>&times;</b>
				</div>
			);
		}
	}

	signup(){
		// check that we have the mandatory attributes of `agentName`, `email` and `password`
		if(this.state.agentName && this.state.email && this.state.password){
			// check that the password and password confirmation match
			if(this.state.password == this.state.passwordConfirm){
				// if all checks pass, then toggle the loading icon as we run a syncronous piece of code
				this.setState({loading: true})
				// call the AWS Cognito function that we named `signUpUser`
				signUpUser(this.state)
					.then(({email})=>{
						// if successful, then save the email to localStorage so we can pre-fill the email form on the login & verify account screens
						localStorage.setItem('User_Email', email)
						// re-route to the verify account screen
						browserHistory.push('/auth/verify_account')
					})
					.catch((err)=>{
						console.log(err)
						// if failure, display the error message and toggle the loading icon to disappear
						this.setState({
							errorMessage: err.message,
							loading: false
						})
					})
			}else{
				this.setState({
					errorMessage: "Passwords do not match"
				})
			}
		}else{
			this.setState({
				errorMessage: "Please include an agent name, email address and password."
			})
		}
	}

	redirectToSignin(){
		browserHistory.push('/auth/login')
	}

	render(){
		return (
			<div style={comStyles().mainview}>
				<div style={comStyles().entrance}>
					<img src='../../../res/images/aws_logo.png' style={comStyles().logo} />
					<h1 style={comStyles().userText}>User Sign Up</h1>
					<form style={comStyles().form}>
						<div className='form-group'>
							<label style={comStyles().formText}>Agent Name:</label>
							<input value={this.state.agentName} onChange={this.handleChange.bind(this, "agentName")} type="text" className='form-control' style={comStyles().formInput} />
						</div>
						<div className='form-group'>
							<label style={comStyles().formText}>Email: <span style={comStyles().note}>(Used for login)</span></label>
							<input value={this.state.email} onChange={this.handleChange.bind(this, "email")} type="email" className='form-control' style={comStyles().formInput} />
						</div>
						<div className='form-group'>
							<label style={comStyles().formText}>Password:</label>
							<input value={this.state.password} onChange={this.handleChange.bind(this, "password")} type="password" className='form-control' style={comStyles().formInput} />
						</div>
						<div className='form-group'>
							<label style={comStyles().formText}>Confirm Password:</label>
							<input value={this.state.passwordConfirm} onChange={this.handleChange.bind(this, "passwordConfirm")} type="password" className='form-control' style={comStyles().formInput} />
						</div>
						{this.renderAlert()}

						{
							this.state.loading
							?
							<div style={comStyles().loadingBox}>
								<img src='../../../res/images/loading.gif' style={comStyles().loadingGif} />
							</div>
							:
							<button type='button' style={comStyles().signupButton} onClick={this.signup.bind(this)} className='btn btn-primary btn-block'>Sign Up</button>
						}

					</form>
					<div onClick={this.redirectToSignin.bind(this)} style={comStyles().signin}>Sign In</div>
				</div>
			</div>
		);
	}
};

SignUp.propTypes = {
	signUpUser: React.PropTypes.func.isRequired
};

const RadiumHOC = Radium(SignUp);

function mapStateToProps(state){
	return {
	}
}

export default connect(mapStateToProps, {signUpUser})(RadiumHOC);

// ========================================================



const comStyles = () => {
	return {
		mainview: {
			backgroundColor: xMidBlue,
			width: "100%",
			height: "100%",
			margin: "0",
			left: "0",
			top: "0",
			display: "flex",
			justifyContent: "center"
		},
		entrance: {
			display: "flex",
			flexDirection: "column",
			margin: "auto",
			justifyContent: "center"
		},
		form: {
			width: "500px",
			margin: "auto",
			"@media (max-width: 600px), and (max-height: 740px)": {
				width: "90%"
			}
		},
		formText: {
			color: "black",
			fontSize: "1.2rem",
			fontWeight: "bold"
		},
		signupButton: {
			color: "white",
			fontSize: "1.2rem",
			fontWeight: "bold"
		},
		formInput: {
			fontSize: "1.2rem",
			textAlign: "center",
			backgroundColor: "rgba(0,0,0,0.05)"
		},
		userText: {
			color: "black",
			fontWeight: "bold",
			textAlign: "center",
			margin: "15px auto"
		},
		logo: {
			height: "auto",
			width: "200px",
			margin: "30px auto"
		},
		signup: {
			color: "white",
			fontSize: "1.2rem",
			textAlign: "center",
			margin: "50px auto",
			cursor: "pointer"
		},
		note: {
			fontSize: "1rem",
			color: "black",
		},
		signin: {
			color: "black",
			fontSize: "1.2rem",
			textAlign: "center",
			margin: "50px auto",
			cursor: "pointer"
		},
		errorMessage: {
			margin: "15px auto",
		},
		loadingBox: {
			width: "500px",
			margin: "auto",
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			"@media (max-width: 600px), and (max-height: 740px)": {
				width: "90%"
			}
		},
		loadingGif: {
			width: "50px",
			height: "50px"
		},
		messageClose: {
			float: "right",
			fontSize: "1rem",
			cursor: "pointer"
		}
	}
}
