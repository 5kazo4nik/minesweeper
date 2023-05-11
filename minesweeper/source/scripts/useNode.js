function createNode(el, ...classes) {
  const node = document.createElement(el);
  node.classList.add(...classes);
  return node;
}

function insertNode(parent, child) {
  if (typeof child === 'string') {
    parent.textContent = child;
  } else {
    parent.append(child);
  }
}

export { createNode, insertNode };
