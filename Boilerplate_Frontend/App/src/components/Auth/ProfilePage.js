import React, {Component} from 'react';
import {connect} from 'react-redux';
import Radium from 'radium'
import {browserHistory} from 'react-router'

import {getBackendResource} from '../../api/myAPI'
import {setUser} from '../../actions/auth_actions'
import { updateUserInfo } from '../../api/aws/aws_cognito'

class ProfilePage extends Component {

    constructor(){
      super()
      this.state = {
        loading: false,
        profile: {
          "custom:agentName": ""
        },
        backEndMessage: ""
      }
    }

    componentWillMount(){
      getBackendResource()
        .then((data)=>{
          this.state.backEndMessage = data.message
        })
    }

    componentDidMount(){
      this.state.profile = {
        "custom:agentName": this.props.user.agentName
      }
    }

    signOut(){
  		browserHistory.push('/auth/signout')
    }

    handleProfileChange(attr, event){
  		this.setState({
  			profile: {
          [attr]: event.target.value
        }
  		})
  	}

    saveProfile(){
  		const self = this
  	  if(self.state.profile){
  		    self.setState({loading: true})
  				const editedInfo = {}
          // At the current state of AWS Cognito, no user attributes can be left empty when updating.
          // so we substitute a space string, which evaluates to false in javascript
  				for(let key in this.state.profile){
  					editedInfo[key] = this.state.profile[key]
  					if(this.state.profile[key] == "" || !this.state.profile[key]){
  						editedInfo[key] = " "
  					}
  				}
          updateUserInfo(editedInfo)
      			.then((data)=>{
        			self.props.setUser(data)
      				browserHistory.push('/profile')
      			})
      			.catch((err)=>{
      				// console.log(err)
      				self.setState({
      					errorMessage: err.message,
      					loading: false
      				})
      			})
  		}
	}

	render() {
		return (
			<div style={comStyles().mainview}>
        <h6>{this.state.backEndMessage}</h6>
        <h2>Hello {this.props.user ? this.props.user.agentName : ""}</h2>
				<p>Congrats on making it here! Only verified and logged in users can see this :)</p>

        <div className='form-group' style={comStyles().form}>
          {/* Field name determines the name of the variables being passed to handleSubmit(this.props.signinLandlord) */}
          <input value={this.state.profile["custom:agentName"]} placeholder="Set Agent Name" onChange={this.handleProfileChange.bind(this, 'custom:agentName')} type="text" className='form-control' style={comStyles().formInput} />
          <button className='btn btn-success btn-block' onClick={this.saveProfile.bind(this)}>Update Profile</button>
          <button onClick={this.signOut.bind(this)} className='btn btn-danger btn-block'>Sign Out</button>
        </div>

			</div>
		)
	}
}

ProfilePage.propTypes = {
  user: React.PropTypes.object.isRequired
}

function mapStateToProps(state){
	return {
    user: state.auth.user
	}
}

const RadiumHOC = Radium(ProfilePage)

export default connect(
  mapStateToProps,
  {setUser}
)(RadiumHOC)

// ================================

const comStyles = () => {
	return {
		mainview: {
			textAlign: "center",
			padding: "20px"
		},
    form: {
      width: "300px",
      margin: "50px auto"
    },
    formInput: {
      width: "100%",
      margin: "10px 0px 10px 0px",
      padding: "10px"
    }
	}
}
