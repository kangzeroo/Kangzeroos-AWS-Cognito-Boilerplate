import React, {Component} from 'react';
import {connect} from 'react-redux';
import Radium from 'radium'
import {browserHistory} from 'react-router'

import {getBackendResource} from '../../api/myAPI'

class AuthenticatedPage extends Component {

    constructor(){
      super()
      this.state = {
        backEndMessage: ""
      }
    }

    componentWillMount(){
      getBackendResource()
        .then((data)=>{
          this.state.backEndMessage = data.message
        })
    }

    signOut(){
  		browserHistory.push('/auth/signout')
    }

		render() {
			return (
				<div style={comStyles().mainview}>
          <h6>{this.state.backEndMessage}</h6>
					<p>Congrats on making it here! Only verified and logged in users can see this. :)</p>
          <button onClick={this.signOut.bind(this)} className='btn btn-warning'>Sign Out</button>
				</div>
			)
		}
}

AuthenticatedPage.propTypes = {
}

function mapStateToProps(state){
	return {
	}
}

const RadiumHOC = Radium(AuthenticatedPage)

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
