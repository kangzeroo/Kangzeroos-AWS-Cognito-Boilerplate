# Kangzeroo's Complete AWS Web Boilerplate

###Getting Started###
Welcome to the world of ES6 + React! To start playing with next-generation javascript, clone this repo, install dependencies and start the npm script with the below terminal commands. The source code is heavily documented, to the point where you can learn React-Redux simply by reading the code comments while playing around with the webapp and in-browser Javascript console.

```
	$ git clone https://github.com/kangzeroo/Kangzeroos-ES6-React-Redux-Boilerplate.git
	$ cd Kangzeroos-ES6-React-Redux-Boilerplate
	$ cd App
	$ npm install
	$ npm run start
```

####This Boilerplate Includes#####

```
	- babel											// For compiling ES6 into lower versions for compatibility with older browsers
	- react-router									// S.P.A. routing for React
	- redux-logger									// Logging every redux action in browser console to see "before" and "after" state
	- redux-thunk									// Allow async actions in redux
	- radium										// Programatic CSS via JS written with the component
	- Docker										// For containerizing the app. This is not a node_module
	- SideMenu										// A sidemenu component built-in. This is not a node_module
```

####Running on AWS EC2####
For running this webapp on the Amazon Cloud, git clone this repo into your EC2 instance and start up Docker by following the below steps:

```
	$ git clone https://github.com/kangzeroo/Kangzeroos-ES6-React-Redux-Boilerplate.git
	$ cd Kangzeroos-ES6-React-Redux-Boilerplate
	$ bash build.sh
	$ bash run.sh
```
Then check out http://myIPAddress.com to see the app live!
