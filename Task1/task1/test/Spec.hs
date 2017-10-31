import Test.HUnit
import Test.Framework as TF (defaultMain, testGroup, Test)
import Test.Framework.Providers.HUnit (testCase)
import Test.Framework.Providers.QuickCheck2 (testProperty)

import Trees

main :: IO ()
main = defaultMain tests -- Run the tests

aa, ab :: Trees.Node
aa = Node "A" []
ab = Node "B" [aa]
ac = Node "C" [ab]
ad = Node "D" [ac]
ae = Node "E" [ab]
af = Node "F" [ae]
ag = Node "G" [ad, af]

tests :: [TF.Test]
tests = [testGroup "getParents Tests"
          [ testCase "Get all parents of parentless node" ("" @?= view (getParents aa))
          , testCase "Get all parents of node with one parent" ("A" @?= view (getParents ab))
          , testCase "Get all parents of node with a lot of single parents" ("CBA" @?= view (getParents ad))
          , testCase "Get all parents of node with a lot of varied parents" ("DCBAFE" @?= view (getParents ag))
          ]
        ]
