import Test.HUnit
import Test.Framework as TF (defaultMain, testGroup, Test)
import Test.Framework.Providers.HUnit (testCase)
import Test.Framework.Providers.QuickCheck2 (testProperty)

import Trees

main :: IO ()
main = defaultMain tests -- Run the tests

tests :: [TF.Test]
tests = [testGroup "Example of a test\n\n"
          [ testCase "This should fail" (2+2 @?= 5)
		  , testCase "This should pass" (2+2 @?= 4)
		  ]
		]
