class Node {
    constructor(data) {
        this.data = data;
        this.left = this.right = null;
        this.h = 1;
    }
}

class AVLTree {
    insertNode(root, x) {
        if (root === null) return new Node(x);
        if (x <= root.data)
            root.left = this.insertNode(root.left, x);
        else
            root.right = this.insertNode(root.right, x);

        this.updateHeight(root);

        if (this.getBF(root) === 2) { // Left skewed
            if (this.getBF(root.left) === 1) { // LL skewed
                root = this.rightRotation(root);
            } else { // LR skewed
                root.left = this.leftRotation(root.left);
                root = this.rightRotation(root);
            }
        } else if (this.getBF(root) === -2) { // Right skewed
            if (this.getBF(root.right) === -1) { // RR skewed
                root = this.leftRotation(root);
            } else { // RL skewed
                root.right = this.rightRotation(root.right);
                root = this.leftRotation(root);
            }
        }
        return root;
    }

    updateHeight(root) {
        root.h = 1 + Math.max(root.left ? root.left.h : 0, root.right ? root.right.h : 0);
    }

    getBF(root) {
        return (root.left ? root.left.h : 0) - (root.right ? root.right.h : 0);
    }

    leftRotation(root) {
        let nr = root.right;
        let t2 = nr.left;
        nr.left = root;
        root.right = t2;

        this.updateHeight(root);
        this.updateHeight(nr);

        return nr;
    }

    rightRotation(root) {
        let nr = root.left;
        let t2 = nr.right;
        nr.right = root;
        root.left = t2;

        this.updateHeight(root);
        this.updateHeight(nr);

        return nr;
    }

    deleteNode(root, val) {
        if (root === null) return null;
        if (val < root.data) 
            root.left = this.deleteNode(root.left, val);
        else if (val > root.data)
            root.right = this.deleteNode(root.right, val);
        else {
            if (root.left === null || root.right === null) {
                let temp = root.left ? root.left : root.right;
                if (temp === null) root = null; // case: 0 child
                else root = temp; // case: 1 child
            } else { // case: 2 children
                let temp = this.getMinValueNode(root.right);
                root.data = temp.data;
                root.right = this.deleteNode(root.right, temp.data);
            }
        }

        if (root === null) return root;

        this.updateHeight(root);
        if (this.getBF(root) === 2) { // Left skewed
            if (this.getBF(root.left) === 1) { // LL skewed
                root = this.rightRotation(root);
            } else { // LR skewed
                root.left = this.leftRotation(root.left);
                root = this.rightRotation(root);
            }
        } else if (this.getBF(root) === -2) { // Right skewed
            if (this.getBF(root.right) === -1) { // RR skewed
                root = this.leftRotation(root);
            } else { // RL skewed
                root.right = this.rightRotation(root.right);
                root = this.leftRotation(root);
            }
        }
        return root;
    }

    getMinValueNode(root) {
        let curr = root;
        while (curr.left !== null)
            curr = curr.left;
        return curr;
    }   
}
const tree = new AVLTree();
let root = null;

function insertNode() {
    const value = parseInt(document.getElementById('valueInput').value);
    if (!isNaN(value)) {
        root = tree.insertNode(root, value);
        visualizeTree();
    }
}
function deleteNode() {
    const value = parseInt(document.getElementById('valueInput').value);
    if (!isNaN(value)) {
        const nodeExists = searchInTree(root, value);  // Check if the node exists

        if (nodeExists !== null) {
            root = tree.deleteNode(root, value);
            visualizeTree();
        } else {
            alert("Node not found. Cannot delete.");  // Alert if the node doesn't exist
        }
    }
}

function searchNode() {
    const value = parseInt(document.getElementById('valueInput').value);
    if (!isNaN(value)) {
        const result = searchInTree(root, value);
        if (result !== null) {
            highlightNode(result.data);  // Highlight the found node
        } else {
            alert("Node not found");
        }
    }
}

function searchInTree(node, val) {
    if (node === null) return null;
    if (val < node.data) return searchInTree(node.left, val);
    else if (val > node.data) return searchInTree(node.right, val);
    else return node;  // Node found
}
function highlightNode(value) {
    const nodes = document.querySelectorAll('.node');

    nodes.forEach(node => {
        node.style.backgroundColor = (node.textContent == value) ? 'grey' : 'green';
        node.style.border = (node.textContent == value) ? '3px solid red' : '2px solid black';
    });
}

function resetTree(){
    const container = document.getElementById('treeContainer');
    container.innerHTML = ''; 
    root = null;
}
function visualizeTree() {
    const container = document.getElementById('treeContainer');
    container.innerHTML = ''; //the inner part of continer will be set to blank after each operation
    if (root) {
        const containerWidth = container.offsetWidth;   // Get the current container width
        const centerX = containerWidth / 2;             // Center position
        drawTree(root, container, centerX, 40, 200);    // Start drawing from the center
    }
}


function drawTree(node, parentElement, x, y, offset) { //offset is for distance between parent and child
    if (!node) return;
    const nodeElement = document.createElement('div');
    nodeElement.className = 'node';
    nodeElement.textContent = node.data;
    nodeElement.style.left = `${x}px`;
    nodeElement.style.top = `${y}px`;
    parentElement.appendChild(nodeElement);

    if (node.left) {
        drawLine(x, y, x - offset, y + 80, parentElement); 
        drawTree(node.left, parentElement, x - offset, y + 80, offset / 2);
    }

    if (node.right) {
        drawLine(x, y, x + offset, y + 80, parentElement);
        drawTree(node.right, parentElement, x + offset, y + 80, offset / 2);
    }
}


function drawLine(x1, y1, x2, y2, parentElement) {
    const line = document.createElement('div');
    line.className = 'line';

    const nodeRadius = 20;        // Node radius
    const extraOffset = 10;        // Extra offset to fully clear the node's edge

    const angle = Math.atan2(y2 - y1, x2 - x1);

    // Adjust start and end points with extra offset
    const startX = x1 + (nodeRadius + extraOffset) * Math.cos(angle);
    const startY = y1 + (nodeRadius + extraOffset) * Math.sin(angle);
    const endX = x2 - (nodeRadius + extraOffset) * Math.cos(angle);
    const endY = y2 - (nodeRadius + extraOffset) * Math.sin(angle);

    const length = Math.hypot(endX - startX, endY - startY);

    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle * (180 / Math.PI)}deg)`;
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;

    parentElement.appendChild(line);
}

