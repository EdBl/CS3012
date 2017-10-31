import Test.HUnit
import Test.Framework as TF (defaultMain, testGroup, Test)
import Test.Framework.Providers.HUnit (testCase)
import Test.Framework.Providers.QuickCheck2 (testProperty)
import Data.List (intersect)

import Trees

main :: IO ()
main = defaultMain tests -- Run the tests

aa = Node "A" []
ab = Node "B" [aa]
ac = Node "C" [ab]
ad = Node "D" [ac]
ae = Node "E" [ab]
af = Node "F" [ae]
ag = Node "G" [ad, af]

bf = Node "F" []
be = Node "E" [bf]
bd = Node "D" [be]
bc = Node "C" [be]
bb = Node "B" [bc, bd, be]
ba = Node "A" [bb]
bg = Node "G" [bd]


tests :: [TF.Test]
tests = [
        
        testGroup "getParents tests for tree A"
          [ testCase "Get all parents of parentless node" ("" @?= view (getParents aa))
          , testCase "Get all parents of node with one parent" ("A" @?= view (getParents ab))
          , testCase "Get all parents of node with a lot of single parents" ("CBA" @?= view (getParents ad))
          , testCase "Get all parents of node with a lot of varied parents" ("DCBAFE" @?= view (getParents ag))
          ]
          
        ,testGroup "getParents tests for tree B"
          [ testCase "Get all parents of parentless node" ("" @?= view (getParents bf))
          , testCase "Get all parents of node with one parent" ("F" @?= view (getParents be))
          , testCase "Get all parents of node with a lot of single parents" ("DEF" @?= view (getParents bg))
          , testCase "Get all parents of node with a lot of varied parents" ("BCEFD" @?= view (getParents ba))
          ]
          
        ,testGroup "getLCAs tests for tree A"
          [ testCase "Get LCA when theres no LCA" (view (getLCAs aa ag) @?= "")
          , testCase "Get LCA for the same node" (view (getLCAs ad ad) @?= "C")
          , testCase "Get LCA for D and F" (view (getLCAs ad af) @?= "B")
          , testCase "Get LCA for G and B" (view (getLCAs ag ab) @?= "A")
          , testCase "Get LCA for G and F" (view (getLCAs ag af) @?= "E")
          ]
          
        ,testGroup "getLCAs tests for tree B"
          [ testCase "Get LCA when theres no LCA" (view (getLCAs ba bf) @?= "")
          , testCase "Get LCA for the same node" (view (getLCAs ba ba) @?= "B")
          , testCase "Get LCA for A and G" (view (getLCAs ba bg) @?= "D")
          , testCase "Get LCA for B and D" (view (getLCAs bb bd) @?= "E")
          , testCase "Get LCA for B and C" (view (getLCAs bb bc) @?= "E")
          , testCase "Get LCA for B and E" (view (getLCAs bb be) @?= "F")
          , testCase "Get LCA for A and D" (view (getLCAs ba bd) @?= "E")
          ]
          
        ]
