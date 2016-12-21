import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Radium from 'radium'
import { browserHistory } from 'react-router'

import { xMidBlue } from '../../stylesJS/base_colors'
import {authenticateUser} from '../../actions/auth_actions';

import {forgotPassword} from '../../api/aws/aws_cognito'

class ResetPassword extends Component {

	constructor(){
		super()
		this.state = {
			email: "",
			password: "",
			confirm_password: "",
			pin: "",
			cognitoUserPackage: false,
			errorMessage: null,
			loading: false
		}
	}

	handleChange(attr, event){
		this.setState({
			[attr]: event.target.value
		})
	}

	sendVerificationEmail(){
		this.setState({loading:true})
		forgotPassword(this.state.email)
			.then((cognitoUserPackage)=>{
				this.setState({
					cognitoUserPackage: cognitoUserPackage,
					loading: false
				})
			})
			.catch((err)=>{
				this.setState({
					errorMessage: err.message,
					loading: false
				})
			})
	}

	verifyPin(){
		if(this.props.password == this.props.confirm_password){
			this.state.cognitoUserPackage.cognitoUser
				.confirmPassword(this.state.pin, this.state.password, this.state.cognitoUserPackage.thirdArg)
			setTimeout(()=>{
				browserHistory.push("/auth/login")
			}, 500)
		}
	}


	render(){
		return (
			<div style={comStyles().mainview}>
				<div style={comStyles().entrance}>
					<img src='../../../res/images/aws_logo.png' style={comStyles().logo} />
					<h1 style={comStyles().landlordText}>Reset Password</h1>
					<form style={comStyles().form}>
						{
							this.state.cognitoUserPackage
							?
							<div>
								<div className='form-group'>
									<label style={comStyles().formText}>Email</label>
									<input value={this.state.email} onChange={this.handleChange.bind(this, 'email')} type="text" className='form-control' style={comStyles().formInput} />
								</div>
								<div className='form-group'>
									<label style={comStyles().formText}>Verification PIN</label>
									<input value={this.state.pin} onChange={this.handleChange.bind(this, 'pin')} type="text" className='form-control' style={comStyles().formInput} />
								</div>
								<div className='form-group'>
									<label style={comStyles().formText}>New Password</label>
									<input value={this.state.password} onChange={this.handleChange.bind(this, 'password')} type="password" className='form-control' style={comStyles().formInput} />
								</div>
								<div className='form-group'>
									<label style={comStyles().formText}>Confirm Password</label>
									<input value={this.state.confirm_password} onChange={this.handleChange.bind(this, 'confirm_password')} type="password" className='form-control' style={comStyles().formInput} />
								</div>
								<button onClick={this.verifyPin.bind(this)} style={comStyles().button} type='button' className='btn btn-primary btn-block'>Change Password</button>
							</div>
							:
							<div>
								<div className='form-group'>
									<label style={comStyles().formText}>Email</label>
									<input value={this.state.email} onChange={this.handleChange.bind(this, 'email')} type="email" className='form-control' style={comStyles().formInput} />
								</div>
								{
									this.state.loading
									?
									<div style={comStyles().loadingBox}>
										<img src='../../../res/images/loading.gif' style={comStyles().loadingGif} />
									</div>
									:
									<button onClick={this.sendVerificationEmail.bind(this)} style={comStyles().button} type='button' className='btn btn-primary btn-block'>Send Reset PIN</button>
								}
							</div>
						}
					</form>
					{
						this.state.errorMessage
						?
						<div className='alert alert-danger' style={comStyles().errorMessage}>
							{this.state.errorMessage}
							<b onClick={()=>this.setState({errorMessage: ""})} style={comStyles().messageClose}>&times;</b>
						</div>
						:
						null
					}
					<div onClick={()=>browserHistory.push('/auth/login')} style={comStyles().back}>Back To Login</div>
				</div>
			</div>
		);
	}
}

ResetPassword.propTypes = {
};

const RadiumHOC = Radium(ResetPassword);

// if there is an error, it will appear on the state tree
function mapStateToProps(state){
	return {
	}
}

export default connect(mapStateToProps)(RadiumHOC);


// =========================================================


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
			fontWeight: "bold",
		},
		formInput: {
			fontSize: "1.2rem",
			textAlign: "center",
			backgroundColor: "rgba(256,256,256,0.9)"
		},
		landlordText: {
			color: "black",
			fontWeight: "bold",
			textAlign: "center",
			margin: "15px auto"
		},
		logo: {
			height: "auto",
			width: "200px",
			margin: "15px auto"
		},
		button: {
			color: "white",
			fontSize: "1.2rem",
			fontWeight: "bold"
		},
		back: {
			color: "black",
			fontSize: "1.2rem",
			textAlign: "center",
			margin: "50px auto",
			cursor: "pointer"
		},
		errorMessage: {
			width: "500px",
			margin: "15px auto",
			"@media (max-width: 600px), and (max-height: 740px)": {
				width: "90%"
			}
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
