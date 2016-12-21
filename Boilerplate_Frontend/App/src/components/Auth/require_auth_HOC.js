import React, { Component } from 'react';
import { connect } from 'react-redux';
import {browserHistory} from 'react-router'

// this 'higher order component'(HOC) creator takes a component (called ComposedComponent)
// and returns a new component with added functionality
export default function(ComposedComponent){

	class Authentication extends Component {

		// this.context gives access to upper components
		// but react-router prevents abuse of this.context by requiring explicit expression
		// so contextTypes{} is a React way of seeing these objects
		// `static` means contextTypes is a class defined property (the original blueprint)
		// static contextTypes = {
		// 	router: React.PropTypes.object
		// }
		// we can use this explicit method using
		// this.context.router.push('/auth/login')

		// or just directly import browserHistory from 'react-router'
		// browserHistory.push('/auth/login')


		// runs once on initilization when the component is initially rendered
		// componentWillMount() renders on server before sending out to client
		// whereas componentDidMount() renders on client
		componentWillMount(){
			if(!this.props.authenticated){
				browserHistory.push('/auth/login')
				// this.context.router.push('/auth/login')
			}
		}

		// componentWillUpdate() is called each time the component gets a new set of props or re-rendered
		// the first arg `nextProps` defines the next set of properties a component will get rendered with
		componentWillUpdate(nextProps){
			// to clear the text on the `/resources` page after signing out, push url to the home route
			if(!nextProps.authenticated){
				browserHistory.push('/auth/login')
				// this.context.router.push('/auth/login');
			}
		}

		render() {
			// the rendered composed component, with props passed through
			return <ComposedComponent {...this.props} />
		}
	}


	function mapStateToProps(state){
		return {
			authenticated: state.auth.authenticated
		}
	}

	// we nest our custom HOC to connect(), which in itself is a HOC
	// we can actually nest HOC infinitely deep
	return connect(mapStateToProps)(Authentication);
}

// Pseudo-code demonstrating how to use the higher order component (HOC)
/*
	// In some other location (not in this file), we want to use this HOC...
	import Authentication	// The HOC
	import Resources		// The component to be wrapped
	const ComposedComponent = Authentication(Resources);

	// In some render method...
	<ComposedComponent />

	// <ComposedComponent> actually renders the Authentication class, which renders the composed component
	// This 2 layer method is powerful because when we pass in props to <ComposedComponent> like below:
	<ComposedComponent propA={propA} />
	// we can pass those props into the 2nd layer (composed component) using a correct 'this' reference to the 1st layer
*/
