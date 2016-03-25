import { render, patch } from './vdom'

export * from './vdom'
export * from './redux'

const identical = v => v

export function bootstrap(App, store, getActions = identical) {
  const actions = getActions(function() {
    return store.dispatch.apply(store, arguments)
  })

  let lastState = App(store.getState(), actions)

  const element = render(lastState)

  store.subscribe(() => {
    const nextState = App(store.getState(), actions)
    patch(lastState, nextState, element)
    lastState = nextState
  })

  return element
}
