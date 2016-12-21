// See <App> (ie ../app.js) to read documentation on how a React component works
import React, {Component} from 'react'
import {connect} from 'react-redux'
import Radium from 'radium'

import { toggleSideMenu } from '../../actions/sideMenuActions'

class SideIcon extends Component {

	render() {
		return (
			<div onClick={this.props.toggleSideMenu} style={comStyles(this.props.sideMenuVisible).icon}>
				<i className='ion-navicon-round'></i>
			</div>
		)
	}
}

SideIcon.propTypes = {
  toggleSideMenu: React.PropTypes.func.isRequired,
	sideMenuVisible: React.PropTypes.bool
}

const RadiumHOC = Radium(SideIcon)

function mapStateToProps(state){
	return {
		sideMenuVisible: state.sideMenu.visible
	}
}

export default connect(mapStateToProps, {toggleSideMenu})(RadiumHOC)

// ================================

const comStyles = (sideMenuVisible) => {
	let paramsCSS = {
		position: "absolute",
		margin: "20px 0px 0px 20px",
		zIndex: "98"
	}
	if(sideMenuVisible){
		paramsCSS.margin = "0 auto"
		paramsCSS.zIndex = "100"
	}
	return {
		icon: {
      fontSize: "1.5rem",
			...paramsCSS
		}
	}
}
