import RedBlackTree from "./red-black-tree.js";

const tree = new RedBlackTree();
tree.insert(5);
tree.insert(6);
tree.insert(2);
tree.insert(3);
tree.insert(4);
tree.insert(7);

tree.traverse();
tree.dump();
