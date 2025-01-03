import RedBlackTree from "./red-black-tree.js";

let tree;
init();

function init() {
  setupButtons();

  tree = new RedBlackTree();

  tree.insert(8);
  tree.insert(5);
  tree.insert(15);
  tree.insert(12);
  tree.insert(19);
  tree.insert(9);
  tree.insert(13);
  tree.insert(23);
  tree.insert(10);
  tree.insert(27);
  tree.insert(28);

  generateVisualTree();
}

function generateVisualTree() {
  if (tree.root == null) return;

  const initialUl = document.querySelector(".initial-ul");
  initialUl.innerHTML = "";

  const buildTree = (node) => {
    if (!node) return null;

    const li = document.createElement("li");
    const span = document.createElement("span");
    span.classList.add("tf-nc");
    span.innerHTML = `${node.value}`;

    // set css class for black/red
    if (node.color == "BLACK") {
      span.classList.add("black");
    } else {
      span.classList.add("red");
    }

    // handle NIL nodes' value
    if (node == tree.NIL) {
      span.innerHTML = "NIL";
      li.appendChild(span);
      return li;
    }

    li.appendChild(span);

    const ul = document.createElement("ul");
    const leftChild = buildTree(node.left); // recursion through left nodes
    if (leftChild) {
      ul.appendChild(leftChild);
    }

    const rightChild = buildTree(node.right); // recursion through right nodes
    if (rightChild) {
      ul.appendChild(rightChild);
    }

    li.appendChild(ul);
    return li;
  };

  const rootLi = buildTree(tree.root);
  if (rootLi) {
    initialUl.appendChild(rootLi);
  }
}

function setupButtons() {
  const insertForm = document.querySelector("#insert-form");
  const deleteForm = document.querySelector("#delete-form");
  const deleteButton = document.querySelector("#clear-button");

  insertForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const number = insertForm.number.valueAsNumber;

    if (isNaN(number)) {
      return;
    }

    tree.insert(number);
    generateVisualTree();
  });

  deleteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const number = deleteForm.number.valueAsNumber;
    tree.delete(number);
    generateVisualTree();
  });

  deleteButton.addEventListener("click", () => {
    tree.clear();
    generateVisualTree();
  });
}

/**
 * Sleep function taken from
 * https://www.geeksforgeeks.org/what-is-the-javascript-version-of-sleep-method/
 * Used to visualise the algorithm step-by-step
 */
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
