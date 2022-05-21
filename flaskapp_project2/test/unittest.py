import unittest, os
from urllib import response
import sys
sys.path.append('../')
import flaskapp 

class FlaskTest(unittest.TestCase):
  def test_play_without_login(self):
    tester = flaskapp.create_app().test_client(self)
    response = tester.get("/play")
    print(response)
    statusCode = response.status_code
    self.assertEqual(statusCode,302)

  def test_login(self):
    tester = flaskapp.create_app().test_client(self)
    response = tester.get("/auth/login")
    print(response)
    statusCode = response.status_code
    self.assertEqual(statusCode,200)

if __name__=='__main__':
  unittest.main()
