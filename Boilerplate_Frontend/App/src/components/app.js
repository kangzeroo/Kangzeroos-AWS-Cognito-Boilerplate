// we import a variety of code to be used in this component
// for simplicity purposes, there is another set of component documentation at `./home.js`. please also read that

// `React` is used for general React functions, such as declaring property types (eg `React.PropTypes.bool`)
// `Component` is a ES6 class that defines the format of React components, which is done with `extends`
import React, { Component } from 'react'

// connect() is a state-related HOC "higher order component" use to wrap around our React component. HOCs give additional functionality to a component.
import {connect} from 'react-redux'

// 'Radium' is a styling HOC "higher order component" use to wrap around our React component. HOCs give additional functionality to a component.
							// The purpose of Radium is to programmatically create CSS attributes to be used in our component
							// The advantage is that CSS is no longer global (leading to cleaner, more contained code) and can by dynamically created
import Radium from 'radium'
// Another great advantage of programatic CSS using Radium is that we can make CSS variables, such as base color schemas used throughout the app
import { xWhiteSmoke } from '../stylesJS/base_colors'

// We can import other components (eg <ComponentA>, <ComponentB>, <ComponentC>) which we may be nested inside this component
import SideMenu from './SideMenu/SideMenu'
import SideIcon from './SideMenu/SideIcon'


// We can also import action creators, for changing the Redux state from inside our component.
              // If we import action creators, they must be passed in with an object to the connect() HOC as the 2nd arguement
import { toggleSideMenu } from '../actions/sideMenuActions'

// import StyleRoot to be used for Radium style media queries
import {StyleRoot} from 'radium';


// we create our <App> component, but to inherit the behavior of a React component, we must `extends` the `Component` that was imported from React (see above)
class App extends Component {

  // for the App class, we can register a function that can be called anywhere in this app
  // in this case, renderSideMenu() is a function that returns HTML
  renderSideMenu(){
    return (
      <div>
        {/* JS is wrapped in these curly braces. Below is a ternary operator to determine if <SideIcon> should be displayed */}
        {this.props.sideMenuVisible ? null : <SideIcon />}
        <SideMenu />
      </div>
    )
  }

  // the render() function determines the HTML that will be displayed by this <App> component
  render() {
    return (
      // Notice <div style={comStyles().app}> receives its CSS styling from the `comStyles()` function
      // this is what we mean by programatic CSS (via Javascript). See below for `comStyles()`
      <StyleRoot>
        <div style={comStyles().app}>
          {/* we call a function of this component using this.renderSideMenu(). `this` refers to <App> */}
          {this.renderSideMenu()}
          <div>
            {/* We have a onClick that calls a Redux action creator from `../actions/sideMenuActions.js` */}
            <div onClick={this.props.toggleSideMenu} style={comStyles(this.props.sideMenuVisible).shadow}></div>
            {/* Recall that inside ../index.js we defined <Route path='/' component={App}> as the deepest route
                  in the component tree. The child routes are accessabile with {this.props.children} */}
            {this.props.children}
          </div>
        </div>
      </StyleRoot>
    )
  }
}

// We can define the attributes that <App> will used
// Possible attributes include `bool`, `number`, `string`, `object`, `array` and `isRequired`
// This also acts as a form of documentation
App.propTypes = {
  toggleSideMenu: React.PropTypes.func.isRequired,
  sideMenuVisible: React.PropTypes.bool
}

// Now we wrap the entire <App> component inside the Radium `higher order component` wrapper
// A `higher order component` simply gives additional functionality to a component. In this case, the Radium HOC allows for programatic CSS
const RadiumHOC = Radium(App)

// We use the `mapStateToProps()` function to pass Redux state attributes to the <App> component
// We will pass in mapStateToProps() to a connect() HOC to give this additional functionality
function mapStateToProps(state){
  return {
    // state.sideMenu.visible will be accessible by <App> using this.props.sideMenuVisible
    sideMenuVisible: state.sideMenu.visible
  }
}

// connect() is a React-Redux HOC that gives additional functionality to <App>
// specifically, it gives a mapping to the Redux state via mapStateToProps(). This will be the first arguement to connect()
// it also gives access to action creators by passing them in as part of an object. This will be the second arguement to connect()
// finally we pass in RadiumHOC that we created earlier. We can infinitely nest HOC inside eachother
// now we can export this results on this connect(), which is our final <App> HOC that can be used throughout our app
export default connect(mapStateToProps, {toggleSideMenu})(RadiumHOC)

// ================================


// `comStyles()` is a function that returns an object mapping of CSS attributes
// we do computations to programmatically determine the outputted CSS
const comStyles = (sideMenuVisible) => {
  let paramCSS = {
    display: "none",
    backgroundColor: "rgba(0,0,0,0)"
  }
  if(sideMenuVisible){
    paramCSS.display = "flex"
    paramCSS.backgroundColor = "rgba(0,0,0,0.3)"
    paramCSS.transition = "background-color 0.5s ease"
  }
  return {
    // unlike CSS, we cannot use snake-case, and instead must use camelCase
    // and the values in each key-value pair must be wrapped in "quotations", unless we want to use an imported variable
    app: {
      width: "100%",
      height: "100vh",
      margin: "0",
			left: "0",
			top: "0",
			position: "fixed",
      backgroundColor: xWhiteSmoke,
    },
    sideMenuIcon: {
      position: "absolute",
      margin: "20px 0px 0px 20px",
			zIndex: "99"
    },
    shadow: {
      width: "100%",
      height: "100%",
      position: "absolute",
      ...paramCSS
    }
  }
}
