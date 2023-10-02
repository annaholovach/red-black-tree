const {Stack} = require('../data-structures/stack')

const CONSTANTS = {
    RED: 'RED',
    BLACK: 'BLACK'
}

class Node {
    constructor(param) {
        // Constructor for a node
        this.key = param.key || 0
        this.color = param.color || CONSTANTS.RED
        this.left = param.left || undefined
        this.right = param.right || undefined
        this.parent = param.parent || undefined
    }
}

class RedBlackTree {
    constructor() {
        this.leaf = new Node({key: 0, color: CONSTANTS.BLACK})
        this.root = this.leaf
    }

    // Method performs a left rotation for tree balancing
    rotateLeft(node) {
        const vertex = node.right

        node.right = vertex.left
        if (vertex.left != this.leaf) {
            vertex.left.parent = node
        }

        vertex.parent = node.parent

        if(!node.parent) {
            this.root = vertex
        } else if (node === node.parent.left) {
            node.parent.left = vertex
        } else {
            node.parent.right = vertex
        }

        vertex.left = node
        node.parent = vertex
    }

    // Method performs a right rotation for tree balancing
    rotateRight(node) {
        const vertex = node.left

        node.left = vertex.right
        if (vertex.right != this.leaf) {
            vertex.right.parent = node
        }

        vertex.parent = node.parent

        if(!node.parent) {
            this.root = vertex
        } else if (node === node.parent.right) {
            node.parent.right = vertex
        } else {
            node.parent.left = vertex
        }

        vertex.right = node
        node.parent = vertex
    }

    // Method inserts a new node with the specified key into the tree
    insert({key}) {
        const node = new Node({
            key,
            left: this.leaf,
            right: this.leaf
        })

        let parent
        let tmp = this.root

        while(tmp !== this.leaf) {
            parent = tmp
            if (node.key < tmp.key) {
                tmp = tmp.left
            } else {
                tmp = tmp.right
            }
        }
        node.parent = parent

        if(!parent) {
            this.root = node
        } else if (node.key < parent.key) {
            parent.left = node
        } else {
            parent.right = node
        }

        if(!node.parent) {
            node.color = CONSTANTS.BLACK
            return
        }
        if(!node.parent.parent) {
            return
        }
        this.balanceInsert(node)
    }

    // Method performs balancing after insertion
    balanceInsert(node) {
        while(node.parent.color === CONSTANTS.RED) {
            if(node.parent === node.parent.parent.left) {
                const uncle = node.parent.parent.right
                if(uncle.color === CONSTANTS.RED) {
                    uncle.color = CONSTANTS.BLACK
                    node.parent.color = CONSTANTS.BLACK
                    node.parent.parent.color = CONSTANTS.RED
                    node = node.parent.parent
                } else {
                    if (node === node.parent.right) {
                        node = node.parent
                        this.rotateLeft(node)
                    }
                    node.parent.color = CONSTANTS.BLACK
                    node.parent.parent.color = CONSTANTS.RED
                    this.rotateRight(node.parent.parent)
                }
            } else {
                const uncle = node.parent.parent.left
                if(uncle.color === CONSTANTS.RED) {
                    uncle.color = CONSTANTS.BLACK
                    node.parent.color = CONSTANTS.BLACK
                    node.parent.parent.color = CONSTANTS.RED
                    node = node.parent.parent
                } else {
                    if (node === node.parent.left) {
                        node = node.parent
                        this.rotateRight(node)
                    }
                    node.parent.color = CONSTANTS.BLACK
                    node.parent.parent.color = CONSTANTS.RED
                    this.rotateLeft(node.parent.parent)
            }
        }
        if (node == this.root) {
            break
        }
    }
        this.root.color = CONSTANTS.BLACK
    }

    // Method finds the node with the minimum key in a subtree
    minimum(node) {
        while(node.left != this.leaf) {
            node = node.left
        }
        return node
    }

    // Method replaces one node with another in the tree
    replace(oldNode, newNode) {
        if (!oldNode.parent) {
            this.root = newNode
        } else if (oldNode == oldNode.parent.left) {
            oldNode.parent.left = newNode
        } else {
            oldNode.parent.right = newNode
        }
        newNode.parent = oldNode.parent
    }

    // Method deletes a node with the specified key from the tree
    delete(key) {
        let forRemove = this.leaf
        let tmp = this.root

        while (tmp != this.leaf) {
            if (tmp.key === key) {
                forRemove = tmp
                break
            }

            if (tmp.key > key) {
                tmp = tmp.left
            } else {
                tmp = tmp.right
            }
        }
        if (forRemove == this.leaf) {
            return 'node not found'
        }

        let minRight = forRemove
        let minRightColor = minRight.color
        let newMinRight

        if (forRemove.left == this.leaf) {
            newMinRight = forRemove.right
            this.replace(forRemove, forRemove.right)
        } else if (forRemove.right == this.leaf) {
            newMinRight = forRemove.left
            this.replace(forRemove, forRemove.left)
        } else {
            minRight = this.minimum(forRemove.right)
            minRightColor = minRight.color
            newMinRight = minRight.right

            if(minRight.parent === forRemove) {
                newMinRight.parent = minRight
            } else {
                this.replace(minRight, minRight.right) 
                minRight.right = forRemove.right
                minRight.right.parent = minRight
            }
            this.replace(forRemove, minRight)
            minRight.left = forRemove.left
            minRight.left.parent = minRight
            minRight.color = forRemove.color
        }
        if (minRightColor === CONSTANTS.BLACK) {
            this.balanceDelete(newMinRight)
        }
    }

    // Method performs balancing after deletion
    balanceDelete(node) {
        while (node != this.root && node.color == CONSTANTS.BLACK) {
            if (node == node.parent.left) {
                let brother = node.parent.right

                if (brother.color == CONSTANTS.RED) {
                    brother.color = CONSTANTS.BLACK
                    node.parent.color = CONSTANTS.RED
                    this.rotateLeft(node.parent)
                    brother = node.parent.right
                }

                if (
                    brother.left.color == CONSTANTS.BLACK &&
                    brother.right.color == CONSTANTS.BLACK
                ) {
                    brother.color = CONSTANTS.RED
                    node = node.parent
                } else {
                    if (brother.right.color == CONSTANTS.BLACK) {
                        brother.left.color = CONSTANTS.BLACK
                        brother.color = CONSTANTS.RED
                        this.rotateRight(brother)
                        brother = node.parent.right
                    }
                    brother.color = node.parent.color
                    node.parent.color = CONSTANTS.BLACK
                    brother.right.color = CONSTANTS.BLACK
                    this.rotateLeft(node.parent)
                    node = this.root
                }
            } else {
                let brother = node.parent.left

                if (brother.color == CONSTANTS.RED) {
                    brother.color = CONSTANTS.BLACK
                    node.parent.color = CONSTANTS.RED
                    this.rotateRight(node.parent)
                    brother = node.parent.left
                }

                if (
                    brother.left.color == CONSTANTS.BLACK &&
                    brother.right.color == CONSTANTS.BLACK
                ) {
                    brother.color = CONSTANTS.RED
                    node = node.parent
                } else {
                    if (brother.left.color == CONSTANTS.BLACK) {
                        brother.right.color = CONSTANTS.BLACK
                        brother.color = CONSTANTS.RED
                        this.rotateLeft(brother)
                        brother = node.parent.left
                    }
                    brother.color = node.parent.color
                    node.parent.color = CONSTANTS.BLACK
                    brother.left.color = CONSTANTS.BLACK
                    this.rotateRight(node.parent)
                    node = this.root
            }
        }
    }
    node.color = CONSTANTS.BLACK
    }

    // Method prints the tree structure on the screen
    printTree() {
        const stack = new Stack({ node: this.root, str: '' })
        while (!stack.isEmpty()) {
            const item = stack.pop()
            if (item.node == this.leaf) {
                continue
            }
            let position = ''
            if (item.node.parent) {
                position = item.node === item.node.parent.left ? 'L---' : 'R---'
            } else {
                position = 'ROOT-'
            }
            console.log(`${item.str}${position} ${item.node.key} (${item.node.color})`)
            stack.push({ node: item.node.right, str: item.str + '     ' })
            stack.push({ node: item.node.left, str: item.str + ' |   ' })
        }
    }

    // Method searches for a node with the specified key in the tree
    findNode(key) {
        let node = this.root
        while (node != null) {
            if (key < node.key) {
                node = node.left
            } else if (key > node.key) {
                node = node.right
            } else if (key === node.key) {
                return node
            } else {
                return null
            }
        }
        return null
    }
}

const t = new RedBlackTree()
for (let i = 1; i < 20; i++) {
    t.insert({ key: i });
}
console.log(t.findNode(5));
t.printTree();

for (let i = 1; i < 20; i++) {
    if (i % 3 === 0) {
        t.delete(i);
    }
}
t.printTree();