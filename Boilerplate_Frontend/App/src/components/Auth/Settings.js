import React, {Component} from 'react';
import {connect} from 'react-redux';
import Radium from 'radium'

class Settings extends Component {

		render() {
			return (
				<div style={comStyles().mainview}>
					Settings Page
				</div>
			)
		}
}

Settings.propTypes = {
}

function mapStateToProps(state){
	return {
	}
}

const RadiumHOC = Radium(Settings)

export default connect(

)(RadiumHOC)

// ================================

const comStyles = () => {
	return {
		mainview: {
			textAlign: "center",
			padding: "20px"
		},
	}
}
