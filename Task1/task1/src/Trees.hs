{-# OPTIONS_GHC -fwarn-incomplete-patterns #-}

module Trees where
import Data.List (intersect)

data Node = Node String [Node]

instance Eq Node where
    (Node s _) == (Node t _) = s == t

instance Show Node where
  show (Node s _) = show s



-------------------------------- Functions related to getting LCA below ------------

-- Returns the LCAs of the two nodes
getLCAs :: Node -> Node -> [Node]
getLCAs a b = eliminateNonLCAs ( intersect (getParents a) (getParents b))

-- Returns only the LCAs
eliminateNonLCAs :: [Node] -> [Node]
eliminateNonLCAs n = removeIfDuplicated (addAllParents n)

-- Go through the list of nodes and add each node's parents to the list
addAllParents :: [Node] -> [Node]
addAllParents [] = []
addAllParents [n] = n : (getDirectParents n)
addAllParents (n:ns) = n : (getDirectParents n) ++ (addAllParents ns)

  
  
  
  
-------------------------------- Functions related to getting parents below --------

-- Returns a list of all the parents of the node
getParents :: Node -> [Node]
getParents (Node s n) = removeDuplicates (getParentsH n)

-- Recursively get a list of all parents of the node
getParentsH :: [Node] -> [Node]
getParentsH []     = []
getParentsH [l]    = [l] ++ (beginParents l)
getParentsH (l:ls) = [l] ++ (beginParents l) ++ (getParentsH ls)

-- Begins searching the node's parents
beginParents :: Node -> [Node]
beginParents (Node _ n) = getParentsH n



------------------------------------ Misc functions below --------------------------

-- Instead of using show, more concise.
view :: [Node] -> String
view [] = []
view ((Node s _):ls) = s ++ (view ls)

-- Removes all duplicate nodes
removeDuplicates :: [Node] -> [Node]
removeDuplicates (x:xs) = x : removeDuplicates (filter (/= x) xs)
removeDuplicates [] = []

-- Removes all occureneces of node if it is duplicated
removeIfDuplicated :: [Node] -> [Node]
removeIfDuplicated []     = []
removeIfDuplicated (x:xs) | duplicated == True  = removeIfDuplicated (filter (/= x) xs)
                          | duplicated == False = x: removeIfDuplicated xs
                          where
						    duplicated = elem x xs

getDirectParents (Node _ n) = n

