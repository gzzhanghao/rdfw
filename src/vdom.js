const isArray = Array.isArray
const flattenMap = new WeakMap

export function h(name, props = {}, children = []) {
  if (isArray(props)) {
    return { name, props: {}, children: props }
  }
  return { name, props, children }
}

export function render(tree) {
  if (isTextNode(tree)) {
    return document.createTextNode(tree || '')
  }

  if (isArray(tree)) {
    return tree.map(render)
  }

  return renderElement(tree)
}

export function patch(origin, target, node) {
  if (isTextNode(origin)) {
    if (origin !== target) {
      node.textContent = target
    }
    return
  }

  for (const key of Object.keys(target.props)) {
    if (origin.props[key] !== target.props[key]) {
      node[key] = target.props[key]
    }
  }

  let pointer = node.firstChild

  for (let i = 0, ii = origin.children.length; i < ii; i++) {
    const child = origin.children[i]
    const nextChild = target.children[i]

    if (child && nextChild) {
      pointer = patchChild(node, child, nextChild, pointer)
    } else if (child) {
      pointer = removeChild(node, child, pointer)
    } else if (nextChild) {
      pointer = insertChild(node, nextChild, pointer)
    }
  }
}

function renderElement(tree) {
  const element = document.createElement(tree.name)

  for (const key of Object.keys(tree.props)) {
    element[key] = tree.props[key]
  }

  for (const child of render(flatten(tree.children))) {
    element.appendChild(child)
  }

  return element
}

function patchChild(parent, child, nextChild, pointer_) {
  let pointer = pointer_

  if (!isArray(child)) {
    patch(child, nextChild, pointer)
    return pointer.nextSibling
  }

  const children = flatten(child)
  const keys = children.map(n => n.props.key)

  let index = 0

  for (const node of flatten(nextChild)) {
    const targetIndex = keys.indexOf(node.props.key, index)

    if (targetIndex < 0) {
      pointer = insertChild(parent, node, pointer)
      continue
    }

    for (; index < targetIndex; index++) {
      pointer = removeChild(parent, children[index], pointer)
    }

    patch(children[index++], node, pointer)
    pointer = pointer.nextSibling
  }

  return removeChild(parent, children.slice(index + 1), pointer)
}

function removeChild(parent, children, pointer_) {
  let pointer = pointer_

  for (const child of flatten(children)) {
    const isElement = !isTextNode(child)

    if (isElement && child.props.beforeUnmount) {
      child.props.beforeUnmount(pointer)
    }

    const nextPointer = pointer.nextSibling
    parent.removeChild(pointer)
    pointer = nextPointer

    if (isElement) {
      if (child.props.afterUnmount) child.props.afterUnmount()
      if (child.props.ref) child.props.ref(null)
    }
  }

  return pointer
}

function insertChild(parent, children, pointer) {

  for (const child of flatten(children)) {
    const isElement = !isTextNode(child)

    if (isElement && child.props.beforeMount) {
      child.props.beforeMount()
    }

    const element = renderElement(child)
    if (pointer) {
      parent.insertBefore(element, pointer)
    } else {
      parent.appendChild(element)
    }

    if (isElement) {
      if (child.props.afterMount) child.props.afterMount(element)
      if (child.props.ref) child.props.ref(element)
    }
  }

  return pointer
}

function flatten(node, result = []) {
  if (isArray(node)) {
    for (const value of node) flatten(value, result)
  } else if (isTextNode(node) || (node && typeof node === 'object')) {
    result.push(node)
  }
  return result
}

function isTextNode(value) {
  return typeof value === 'number' ||
    typeof value === 'string'
}
