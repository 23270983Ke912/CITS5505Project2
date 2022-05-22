import unittest
import os
import time
from selenium import webdriver
import sqlite3
from flaskapp import db
import flaskapp
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

basedir = os.path.abspath(os.path.dirname(__file__))


class SystemTest(unittest.TestCase):
    driver = None

    def setUp(self):
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()))

        if not self.driver:
            self.skipTest('Web browser not available')
        else:
            self.app = flaskapp.create_app()
            self.app_context = self.app.app_context()
            self.app_context.push()
            self.client = self.app.test_client()
            if os.path.exists("./test/test.db"):
                os.remove("./test/test.db")
            dbset = sqlite3.connect("./test/test.db")

            with self.app.open_resource('schema.sql') as f:
                dbset.executescript(f.read().decode('utf8'))

            dbset.row_factory = sqlite3.Row

            db.init_db_command

            time.sleep(3)

            self.driver.maximize_window()
            self.driver.get('http://127.0.0.1:5000/play')
            print("done___")

    def tearDown(self):
        if self.driver:
            self.driver.implicitly_wait(3)
            self.driver.quit()

    def test_register_admin(self):

        user = db.get_db().execute(
            'SELECT id, username, isadmin'
            ' FROM user '
            ' WHERE username = ?',
            ("admin1",)
        ).fetchone()
        if not user:
            self.driver.get('http://localhost:5000/auth/register')
            self.driver.implicitly_wait(5)
            username_field = self.driver.find_element(By.ID, "username")
            username_field.send_keys('admin1')
            password_field = self.driver.find_element(By.ID, "password")
            password_field.send_keys('admin1')
            adminpass_field = self.driver.find_element(By.ID, "adminpass")
            adminpass_field.send_keys('admin')
            time.sleep(1)
            self.driver.implicitly_wait(5)
            submit = self.driver.find_element(By.ID, "submit")
            submit.click()
            self.driver.implicitly_wait(5)
            time.sleep(1)

        user = db.get_db().execute(
            'SELECT id, username, isadmin'
            ' FROM user '
            ' WHERE username = ?',
            ("admin1",)
        ).fetchone()

        self.assertFalse(not user,False)

    def test_admin_login(self):
        user = db.get_db().execute(
            'SELECT id, username, isadmin'
            ' FROM user '
            ' WHERE username = ?',
            ("admin1",)
        ).fetchone()
        if not user:
            self.driver.get('http://localhost:5000/auth/register')
            self.driver.implicitly_wait(5)
            username_field = self.driver.find_element(By.ID, "username")
            username_field.send_keys('admin')
            password_field = self.driver.find_element(By.ID, "password")
            password_field.send_keys('admin')
            adminpass_field = self.driver.find_element(By.ID, "adminpass")
            adminpass_field.send_keys('admin')
            time.sleep(1)
            self.driver.implicitly_wait(5)
            submit = self.driver.find_element(By.ID, "submit")
            submit.click()
            self.driver.implicitly_wait(5)
            time.sleep(1)

        self.driver.get('http://localhost:5000/auth/login')
        self.driver.implicitly_wait(5)
        username_field = self.driver.find_element(By.ID, "username")
        username_field.send_keys('admin')
        password_field = self.driver.find_element(By.ID, "password")
        password_field.send_keys('admin')
        time.sleep(1)
        self.driver.implicitly_wait(5)
        submit = self.driver.find_element(By.ID, "submit")
        submit.click()
        self.driver.implicitly_wait(5)
        time.sleep(5)
        print(self.driver.current_url)
        self.assertTrue(self.driver.current_url[-4:],"play")

    def test_register_user(self):

        self.driver.get('http://localhost:5000/auth/register')
        self.driver.implicitly_wait(5)
        username_field = self.driver.find_element(By.ID, "username")
        username_field.send_keys('user')
        password_field = self.driver.find_element(By.ID, "password")
        password_field.send_keys('user')
        adminpass_field = self.driver.find_element(By.ID, "adminpass")
        adminpass_field.send_keys('')
        time.sleep(1)
        self.driver.implicitly_wait(5)
        submit = self.driver.find_element(By.ID, "submit")
        submit.click()
        self.driver.implicitly_wait(5)
        time.sleep(1)

        dbset = db.get_db()

        user = db.get_db().execute(
            'SELECT id, username, isadmin'
            ' FROM user '
            ' WHERE username = ?',
            ("user",)
        ).fetchone()

        self.assertFalse(not user,False)
        


if __name__ == '__main__':
    unittest.main(verbosity=2)
