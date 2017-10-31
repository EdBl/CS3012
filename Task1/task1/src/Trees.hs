{-# OPTIONS_GHC -fwarn-incomplete-patterns #-}

module Trees where
import Data.List (intersect)

data Node = Node String [Node]

instance Eq Node where
    (Node s _) == (Node t _) = s == t

instance Show Node where
  show (Node s _) = show s

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

