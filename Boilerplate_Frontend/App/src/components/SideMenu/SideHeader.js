// See <App> (ie ../app.js) to read documentation on how a React component works
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Radium from 'radium'
// `Link` is a react-router component for routing buttons that redirect you to various urls
import { Link } from 'react-router'

import SideIcon from './SideIcon'

import { toggleSideMenu } from '../../actions/sideMenuActions'

class SideHeader extends Component {
	render() {
		return (
        <div style={comStyles(this.props.sideMenuVisible).mainview}>
          <SideIcon />
          <div style={comStyles().menutitle} className='col-md-12'>SideMenu</div>
          <div onClick={this.props.toggleSideMenu}>
            <i className='ion-close-round' style={comStyles().exit}></i>
          </div>
        </div>
		)
	}
}

SideHeader.propTypes = {
	toggleSideMenu: React.PropTypes.func.isRequired,
	sideMenuVisible: React.PropTypes.bool
}

const RadiumHOC = Radium(SideHeader)

function mapStateToProps(state){
	return {
		sideMenuVisible: state.sideMenu.visible
	}
}

export default connect(mapStateToProps, {toggleSideMenu})(RadiumHOC)

// ================================

const comStyles = (sideMenuVisible) => {
	let paramsCSS = {
		color: "rgba(0,0,0,0)",
    display: "hidden"
	}
	if(sideMenuVisible){
		paramsCSS.color = "white"
    paramsCSS.display = "flex"
	}
	return {
		mainview: {
			padding: "5px",
			textAlign: "center",
			width: "100%",
      margin: "0px 0px 20px 0px",
      padding: "20px",
			...paramsCSS
		},
		menutitle: {
			textAlign: "center",
			fontSize: "1.5rem",
		},
    exit: {
      fontSize: "1.3rem",
    }
	}
}
