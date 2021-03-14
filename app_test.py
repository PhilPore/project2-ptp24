'''Reserved for unit testing.'''
import unittest
import models
from app import get_indexes, handle_users
import app

LEADERBOARD = [{"username": "a", "score": 1}, {"username": "b", "score": 1}]
KEY_INPUT = "input"
KEY_EXPECTED = "expected"
KEY_LENGTH = "length"
KEY_FIRST_WORD = "first_word"
KEY_SECOND_WORD = "second_word"

# "String1 String2 String3".split() => ['String1', 'String2', 'String3']


class UserNoExist(unittest.TestCase):
    '''Tests the bool check to see if a user exists in the list'''
    def setUp(self):
        self.success_test_params = [{
            KEY_INPUT: {
                "user": "John"
            },
            KEY_EXPECTED: True,
        }, {
            KEY_INPUT: {
                "user": "Jo"
            },
            KEY_EXPECTED: True
        }, {
            KEY_INPUT: {
                "user": "Jill"
            },
            KEY_EXPECTED: True
        }]

    def test_user_success(self):
        '''Tests user success'''
        for test in self.success_test_params:
            print(test[KEY_INPUT])
            actual_result = handle_users(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]
            self.assertEqual(actual_result, expected_result)
            self.assertEqual(expected_result, actual_result)


class UserInds(unittest.TestCase):
    '''Tests winner and loser user indexes'''
    def setUp(self):
        self.success_test_params = [{
            KEY_INPUT: {
                "player": "Martha"
            },
            KEY_EXPECTED: [0, 1],
        }, {
            KEY_INPUT: {
                "player": "Stewart"
            },
            KEY_EXPECTED: [1, 0]
        },
        {
            KEY_INPUT: {
                "player": "Johnny"
            },
            KEY_EXPECTED: []
            
        }
        ]

    def test_ind_success(self):
        '''Test get indexes'''
        app.USER_TYPES = ["Martha", "Stewart", "Johnny"]

        for test in self.success_test_params:
            print(test[KEY_INPUT])
            actual_result = get_indexes(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]
            self.assertEqual(actual_result, expected_result)
            self.assertEqual(len(expected_result), len(actual_result))
           


if __name__ == '__main__':
    unittest.main()
