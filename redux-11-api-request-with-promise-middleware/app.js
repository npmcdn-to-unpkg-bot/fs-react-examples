import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import axios from 'axios'
import promiseMiddleware from 'redux-promise-middleware';

const initialState = {
	user: {},
	requesting: false,
	err: null
}

// handling custom actions generated by promise middleware had to be implemented
const reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'REQ_USER_PENDING': return {
			...state, requesting: true
		}
		case 'REQ_USER_FULFILLED': return {
			...state,
			requesting: false,
			user: {
				id: action.payload.data.id,
				username: action.payload.data.username,
				email: action.payload.data.email,
			}
		}
		case 'REQ_USER_REJECTED': return {
			...state,
			requesting: false,
			err: action.error
		}
	}
	return state;
}

const logger = (store) => (next) => (action) => {
	let previous = JSON.stringify(store.getState())
	next(action)
	console.log(
		'action: ' + JSON.stringify(action) +
		'\n\tprevious: ' + previous +
		'\n\tcurrent: ' + JSON.stringify(store.getState())
	)
}

// order of loaded middleware methods matter
const middleware = applyMiddleware(promiseMiddleware(), thunk, logger)
const store = createStore(reducer, middleware)

// Fake Online REST API for Testing and Prototyping
// break url to get an error response
const usersEndpoint = 'https://djsonplaceholder.typicode.com/users/1'


// dispatch action as an object with `type` and `payload`
// promise middleware will fire default actions:
// - {ACTION_NAME}_PENDING
// - {ACTION_NAME}_FULFILLED
// - {ACTION_NAME}_REJECTED
store.dispatch({
	type: 'REQ_USER',
	payload: axios.get(usersEndpoint)
})