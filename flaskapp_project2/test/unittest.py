import flaskapp
from setuptools import setup, find_packages
import unittest
import sys
import os
import random
from werkzeug.security import check_password_hash, generate_password_hash
import sqlite3
import pytest
from flaskapp import create_app
import flaskapp.db as flaskappdb

sys.path.append('../')


class FlaskTest(unittest.TestCase):

    def setUp(self):
        self.app = flaskapp.create_app()
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.client = self.app.test_client()
        print("done")

    def test_db(self):

        if os.path.exists("./test/test.db"):
            os.remove("./test/test.db")
        db = sqlite3.connect("./test/test.db")

        with self.app.open_resource('schema.sql') as f:
            db.executescript(f.read().decode('utf8'))

        db.row_factory = sqlite3.Row

        print(" Added user: user\n password: user\n")
        db.execute(
            "INSERT INTO user (username, isadmin, password ) VALUES (?, ?, ?)",
            ("user", "", generate_password_hash("user"))
        )
        db.commit()

        print(" Added user: admin\n password: admin\n")
        db.execute(
            "INSERT INTO user (username, isadmin, password ) VALUES (?, ?, ?)",
            ("admin", "admin", generate_password_hash("admin"))
        )
        db.commit()

        print(" Added score: 10\n maxcombo: 10\n player: user\n shared\n")
        db.execute(
            "INSERT INTO score (player_id, maxcombo, score, shareable) VALUES (?, ?, ?, ?)",
            (1, 10, 10, "1")
        )
        db.commit()

    def test_play_without_login(self):
        response = self.client.get("/play")
        print("test_play_without_login:", response)
        statusCode = response.status_code
        self.assertEqual(statusCode, 302)

    def test_view_score_without_login(self):
        response = self.client.get("/score")
        print("test_view_score_without_login:", response)
        statusCode = response.status_code
        self.assertEqual(statusCode, 302)

    def test_view_edit_without_login(self):
        response = self.client.get("/edit")
        print("test_view_edit_without_login:", response)
        statusCode = response.status_code
        self.assertEqual(statusCode, 302)

    def test_view_manage_without_login(self):
        response = self.client.get("/manage")
        print("test_view_manage_without_login:", response)
        statusCode = response.status_code
        self.assertEqual(statusCode, 302)

    def test_view_rules_without_login(self):
        response = self.client.get("/rules")
        print("test_view_rules_without_login:", response)
        statusCode = response.status_code
        self.assertEqual(statusCode, 200)

    def test_login(self):
        response = self.client.get("/auth/login")
        print("test_login:", response)
        statusCode = response.status_code
        self.assertEqual(statusCode, 200)

    # def test_logout_redirect(client):
    #     response = client.get("/logout")
    #     print("logout__redirect:", response.request)
    #     client.assertEqual(response.request.path, "/play")


if __name__ == '__main__':
    unittest.main()
