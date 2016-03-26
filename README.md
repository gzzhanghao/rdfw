# rdfw

A lightweight framework with hyperscript and redux like API.

___This project should be considered unstable, use it at your own risk___

## APIs

- h(name: string, children: Array): VNode
- h(name: string, props: Object = {}, children: Array = []): VNode
- render(tree: VNode): Node
- render(tree: Array<VNode>): Array<Node>
- patch(origin: VNode, target: VNode, node: Node): void
- combineReducers(reducers: Object): Object
- bindActions(dispatch: any, actions: Object): Object
- createStore(reducer: Function, initialState: Object = {}): Store
- Store.dispatch(action: Object): void
- Store.subscribe(subscriber: Function): void
- Store.getState(): Object
- bootstrap(App: Function, store: Store, env: any): Node

## Usage

Bootstrap your app

```javascript
import { bootstrap, createStore } from 'rdfw'

import App from './components/App'
import rootReducer from './reducers'

const store = createStore(rootReducer)

document.body.appendChild(
  bootstrap(App, store, store.dispatch.bind(store))
)
```

Create a component

```javascript
import { h } from 'rdfw'
import { update } from '../actions/AppActions'

export default function App(state, dispatch) {
  return (
    h('div', [
      h('span', ['Hello ', state.world]),
      h('input', {
        oninput(event) {
          update(dispatch, event.target.value)
        }
      })
    ])
  )
}
```

Add an action

```javascript
export function update(dispatch, value) {
  dispatch({ type: 'App.update', value })
}
```

And a reducer

```javascript
export default combineReducers({
  world(state = 'world', action) {
    switch (action.type) {
      case 'App.update':
        return action.value
      default:
        return state
    }
  }
})
```

## Some limitations

The diff algorithm I used in the framework is so naive that we have to respect some limitations when working with it:

- Direct children of an element must be fixed size
- Children in arrays must have a unique key
- Type of elements should never change
- Only string and number values will be shown as text node

__Some valid usages__

```javascript
h('element', [
  branch1 && h('child-one'),
  branch2 && h('child-two')
])

h('element', [
  dynamicStringArray.map(str =>
    h('dynamic-children', { key: str }, [str])
  )
])

h('element', [
  /regular-expression/ + ''
])
```

__And here are some invalid:__

```javascript
h('element', dynamicArray.map(v =>
  h('dynamic-children')
))

h('element', [
  [
    'no-key',
    h('no-key')
  ],
  [
    [h('key-conflict', { key: 'key' })],
    [h('key-conflict', { key: 'key' })]
  ]
])

h('element', [
  branch ? h('child-one') : h('child-two')
])

h('element', [
  /regular-expression/
])
```

__Breaking any of these rules may leads to unknown behaviour :P__

## Browser compatibility

The default build of rdfw is only tested on the latest version of chrome. It require browser support for some lattest ES6 features, like arrow functions and iterators. If you want to use it on browser that does not supports ES6, you can require the package with babel-loader and rebuild it with your own configurations. Happy hacking ;)
