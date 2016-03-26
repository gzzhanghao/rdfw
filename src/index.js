import { render, patch } from './vdom'

export * from './vdom'
export * from './redux'

const identical = v => v

export function bootstrap(App, store, env) {
  let lastState = App(store.getState(), env)

  const element = render(lastState)

  store.subscribe(() => {
    const nextState = App(store.getState(), env)
    patch(lastState, nextState, element)
    lastState = nextState
  })

  return element
}
