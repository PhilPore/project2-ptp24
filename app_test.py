
import unittest
import models
from app import get_indexes, handle_users, updt

USER_TYPES = ["Martha"]
LEADERBOARD =[{"username":"a", "score" :1},{"username":"b", "score" :1}]

KEY_INPUT = "input"
KEY_EXPECTED = "expected"
KEY_LENGTH = "length"
KEY_FIRST_WORD = "first_word"
KEY_SECOND_WORD = "second_word"

# "String1 String2 String3".split() => ['String1', 'String2', 'String3']

class SplitTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: {"user":"John"},
                KEY_EXPECTED: ["Martha","John"],
            },
            {
                KEY_INPUT: {"user":"Jo"},
                KEY_EXPECTED: ["Martha", "John","Jo"]
            },
            {
                KEY_INPUT: {"user":"Jill"},
                KEY_EXPECTED: ["Martha", "John","Jo","Jill"]
            }
            # TODO add another
        ]
    ''''    
        self.failure_test_params = [
            {
                KEY_INPUT: "Martha",
                KEY_EXPECTED: ["Martha", "John","Jo"],
            },
            {
                KEY_INPUT: "Glass Animals",
                KEY_EXPECTED: ['Glasss', 'Animal', 's'],
            }
            # TODO add another
        ]'''


    def test_split_success(self):
        for test in self.success_test_params:
            actual_result = handle_users(test[KEY_INPUT])
            
            expected_result = test[KEY_EXPECTED]
            
            self.assertEqual(len(actual_result), len(expected_result))
            self.assertEqual(actual_result[0], expected_result[0])
            self.assertEqual(actual_result[1], expected_result[1])
'''            
    def test_split_failure(self):
        for test in self.failure_test_params:
            actual_result = test[KEY_INPUT].split()
            
            expected_result = test[KEY_EXPECTED]
            
            self.assertNotEqual(len(actual_result), len(expected_result))
            self.assertNotEqual(actual_result[0], expected_result[0])
'''

if __name__ == '__main__':
    unittest.main()



