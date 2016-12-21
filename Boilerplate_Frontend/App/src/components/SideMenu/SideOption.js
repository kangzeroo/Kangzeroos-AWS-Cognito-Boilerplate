// See <App> (ie ../app.js) to read documentation on how a React component works
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Radium from 'radium'
// `Link` is a react-router component for routing buttons that redirect you to various urls
import { Link } from 'react-router'

import { toggleSideMenu } from '../../actions/sideMenuActions'

class SideOption extends Component {
	render() {
		return (
        <Link to={this.props.link} style={comStyles(this.props.sideMenuVisible).mainview} onClick={this.props.toggleSideMenu}>{this.props.text}</Link>
		)
	}
}

SideOption.propTypes = {
  text: React.PropTypes.string.isRequired,
  link: React.PropTypes.string.isRequired,
	toggleSideMenu: React.PropTypes.func.isRequired,
	sideMenuVisible: React.PropTypes.bool
}

const RadiumHOC = Radium(SideOption)

function mapStateToProps(state){
	return {
		sideMenuVisible: state.sideMenu.visible
	}
}

export default connect(mapStateToProps, {toggleSideMenu})(RadiumHOC)

// ================================

const comStyles = (sideMenuVisible) => {
	let paramsCSS = {
		color: "rgba(0,0,0,0)"
	}
	if(sideMenuVisible){
		paramsCSS.color = "white"
	}
	return {
		mainview: {
			padding: "5px",
			textAlign: "center",
			width: "100%",
			":hover": {
				color: "red"
			},
			...paramsCSS
		},
	}
}
