import React, {Component} from 'react';
import { connect } from 'react-redux';
import {logoutUserFromReduxState} from '../../actions/auth_actions';
import Radium from 'radium'
import {browserHistory} from 'react-router'
import { xMidBlue } from '../../stylesJS/base_colors'
import {signOutUser} from '../../api/aws/aws_cognito'

class SignOut extends Component {

	componentWillMount(){
    signOutUser()
		// signoutLandlord() is a function from `actions` coming from index.js
		this.props.logoutUserFromReduxState()
		setTimeout(()=>{
			browserHistory.push('/auth/login')
		}, 1000)
	}

	render() {
		return (
			<div style={comStyles().background}>
				<div style={comStyles().goodbye}>Goodbye!</div>
			</div>
		)
	}
}

SignOut.propTypes = {
	logoutUserFromReduxState: React.PropTypes.func.isRequired
};

const RadiumHOC = Radium(SignOut);

function mapStateToProps(state){
	return {

	}
}

export default connect(null, {logoutUserFromReduxState})(RadiumHOC);


// ==================================


const comStyles = () => {
	return {
		background: {
			backgroundColor: xMidBlue,
			width: "100%",
			height: "100%",
			margin: "0",
			left: "0",
			top: "0",
			display:"flex",
			justifyContent: "center"
		},
		goodbye: {
			fontSize: "1.5rem",
			fontWeight: "bold",
			color: "black",
			margin: "50px auto"
		}
	}
}
