import unittest
import models
from app import get_indexes, handle_users, updt

USER_TYPES = ["Martha", "Stewart","Johnny"]
LEADERBOARD =[{"username":"a", "score" :1},{"username":"b", "score" :1}]

KEY_INPUT = "input"
KEY_EXPECTED = "expected"
KEY_LENGTH = "length"
KEY_FIRST_WORD = "first_word"
KEY_SECOND_WORD = "second_word"

class User_inds(unittest.TestCase):
    def setUp(self):
         self.success_test_params = [
            {
                KEY_INPUT: {"player":"Martha"},
                KEY_EXPECTED: [1,0],
            },
            {
                KEY_INPUT: {"player":"Stewart"},
                KEY_EXPECTED: [0,1]
            }
            # TODO add another
        ]
    def test_split_success(self):
        for test in self.success_test_params:
            print(test[KEY_INPUT])
            actual_result = handle_users(test[KEY_INPUT])
                
            expected_result = test[KEY_EXPECTED]
                
            self.assertEqual(actual_result, expected_result)
            self.assertEqual(expected_result, actual_result)
    
if __name__ == '__main__':
    unittest.main()