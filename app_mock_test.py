import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys
import models
from app import add_new_user, generate_list
import app


KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'user1'

class AddUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT:{'user':'Chuck'},
                KEY_EXPECTED: models.Person(username='Chuck',score=100),
            },
             {
                KEY_INPUT:{'user':'Dur'},
                KEY_EXPECTED: models.Person(username='Dur',score=100),
            },
             {
                KEY_INPUT:{'user':'Shlee'},
                KEY_EXPECTED: models.Person(username='Shlee',score=100),
            }
        ]
        
        initial_person = models.Person(username=INITIAL_USERNAME, score=100)
        self.initial_db_mock = [initial_person]
    
    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)
    
    def mocked_db_session_commit(self):
        pass
    
    def mocked_person_query_all(self):
        return self.initial_db_mock
    
    def test_success(self):
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit', self.mocked_db_session_commit):
                    with patch('models.Person.query') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all
    
                        print(self.initial_db_mock)
                        actual_result = add_new_user(test[KEY_INPUT])
                        print(actual_result)
                        expected_result = test[KEY_EXPECTED]
                        print(self.initial_db_mock)
                        print(expected_result)
                        
                        self.assertEqual(len(actual_result.username),len(expected_result.username))
                        self.assertEqual(actual_result.score, expected_result.score)

class GenList(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_EXPECTED: [INITIAL_USERNAME],
            },
        ]
        
        initial_person = models.Person(username=INITIAL_USERNAME, score=100)
        self.initial_db_mock = [initial_person]
    
    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)
    
    def mocked_db_session_commit(self):
        pass
    
    def mocked_person_query_all(self):
        return self.initial_db_mock
    
    def test_success(self):
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit', self.mocked_db_session_commit):
                    with patch('models.Person.query.filter_by') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all
    
                        print(self.initial_db_mock)
                        actual_result = generate_list()
                        print("-")
                        print(actual_result)
                        print("-")
                        expected_result = test[KEY_EXPECTED]
                        print(self.initial_db_mock)
                        print(expected_result)
                        
                        self.assertEqual(len(actual_result[0]),2)
                        #self.assertEqual(actual_result[0].score, expected_result[0].score)
if __name__ == '__main__':
    unittest.main()