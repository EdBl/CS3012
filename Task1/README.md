# Task 2 - LCA for a DAG
A solution to the Lowest Common Ancestor Problem and extensive testing to make sure the solution is valid.


## Overview

### General info
- All of the implementation code is in `src/Trees.hs`.
- All of the testing code is in `test/Spec.hs`.
- I was using [Stack](https://docs.haskellstack.org/en/stable/README/ "Stack") for this, to run the tests I would recommend getting Stack (if you don't already have it). 
To run the tests use `stack test` in the command line.

### Quick description of the implementation
Each node has a key and an array of pointers to its parent nodes. I am finding the LCA in the following way:
1. Get all parents of `Node A` and all parents of `Node B`.
     * (By _all parents_ I mean recursively go through the node's parents and it's parents' parents etc. until no more parents can be added. For example in Tree A below _all parents_ of Node D would be [C, B, A].)
2. Get the intersection of all parents of `Node A` and `Node B`.
3. From the intersection remove all nodes that are not LCAs. 
    * (In my implementation, a node `n` is not an LCA if there is at least one other node in the list that has `n` as its direct parent.)
4. Return that list.


### Testing
All the tests are located in `test/Spec.hs`. In the next section are images of the trees that were used for testing.

## The Trees from `test/Spec.hs`
| Tree A | Tree B |
| :---: | :---: |
| ![Tree A](images/TreeA.png?raw=true "Tree A") | ![Tree B](images/TreeB.png?raw=true "Tree B")	|