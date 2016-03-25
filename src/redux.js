export function combineReducers(reducers) {
  const keys = Object.keys(reducers)
  return (state, action, fullState = state) => keys.reduce((result, key) => {
    result[key] = reducers[key](state[key], action, fullState)
    return result
  }, {})
}

export function bindActions(dispatch, actions) {
  const result = {}
  for (const action of Object.keys(actions)) {
    if (typeof actions[action] === 'function') {
      result[action] = actions[action].bind(actions, dispatch)
    }
  }
  return result
}

export function createStore(reducer, initialState) {
  return new Store(reducer, initialState)
}

class Store {

  constructor(reducer, initialState = {}) {
    this.state = initialState
    this.reducer = reducer
    this.subscribers = []
    this.dispatch('@@Redux.init')
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action)
    setImmediate(() => {
      for (const subscriber of this.subscribers) {
        subscriber()
      }
    })
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber)
  }

  getState() {
    return this.state
  }
}
