import { createStore, applyMiddleware } from 'redux'

function counterReducer(state = 0, action) {
	switch (action.type) {
		case 'INCREMENT': return state + 1
		case 'DECREMENT': return state - 1
		default: return state
	}
}

const loggerMiddleware = (store) => (next) => (action) => {
	console.log('action dispatched:\n' + JSON.stringify(action))
	next(action)
}

const middleware = applyMiddleware(loggerMiddleware)
const store = createStore(counterReducer, middleware)

console.log('current state:\n' + store.getState())
store.subscribe(() => {
	console.log('current state:\n' + store.getState())
})

let actions = [
	{ type: 'INCREMENT' },
	{ type: 'INCREMENT' },
	{ type: 'DECREMENT' }
]

let index = 0;
let interval = setInterval(() => {
	if (index < actions.length) {

		// dispatch action
		store.dispatch(actions[index])

		return index++
	}
	clearInterval(interval)
}, 500)