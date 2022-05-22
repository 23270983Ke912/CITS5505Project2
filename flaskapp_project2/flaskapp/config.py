import os
import flaskapp
from dotenv import load_dotenv

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or '233333!'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///'+os.path.join(basedir,'app.db')
    DATABASE=os.path.join(flaskapp.app.instance_path, 'flaskapp.sqlite')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class ProductionConfig(Config):
    ENV='production'
    SECRET_KEY = os.environ['SECRET_KEY']
    DATABASE=os.path.join(flaskapp.app.instance_path, 'flaskapp.sqlite')

class DevelopmentConfig(Config):
    FLASK_ENV='development'
    DEBUG=True

class TestingConfig(Config):
    ENV='testing'
    DATABASE=os.path.join(flaskapp.app.instance_path, 'test.sqlite')