// See <App> (ie ./app.js) to read documentation on how a React component works
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Radium from 'radium'

import { xWhiteSmoke } from '../stylesJS/base_colors'

class Home extends Component {

	goToLink(url){
    const win = window.open(url, '_blank');
    win.focus();
  }

	render() {
		return (
			<div style={comStyles().mainview}>
        <div style={comStyles().tray}>
          <h1 style={comStyles().header}>Kangzeroos</h1>
          <h3 style={comStyles().header}>Complete AWS Web Boilerplate</h3>
          <div style={comStyles().logosBox}>
            <img src='../../../res/images/aws_logo.png' onClick={()=> this.goToLink('https://facebook.github.io/react/docs/hello-world.html')} style={comStyles().logo} />
            <img src='../../../res/images/aws_set.png' onClick={()=> this.goToLink('http://redux.js.org/docs/introduction/')} style={comStyles().logos} />
          </div>
        </div>
			</div>
		)
	}
}

Home.propTypes = {
}

const RadiumHOC = Radium(Home);

function mapStateToProps(state){
  return {
  }
}

export default connect(mapStateToProps)(RadiumHOC)


// ================================

const comStyles = () => {
  return {
    mainview: {
      backgroundColor: xWhiteSmoke,
      padding: "20px",
      margin: "auto",
      height: "100%"
    },
    tray: {
      display: "flex",
      flexDirection: "column"
    },
    header: {
      textAlign: "center",
    },
    input: {
      width: "100%",
      margin: "10px 0px 0px 0px",
      display: "flex",
      justifyContent: "center"
    },
    inputBox: {
      padding: "10px"
    },
    logosBox: {
      margin: "50px auto",
      height: "30%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    logo: {
      width: "50%",
      margin: "20px auto",
			maxWidth: "600px"
    },
		logos: {
      width: "80%",
      margin: "50px auto",
			maxWidth: "600px"
		}
  }
}
