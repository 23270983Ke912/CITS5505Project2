import os

from flask import Flask


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        #SECRET_KEY='dev',
<<<<<<< HEAD
        DATABASE=os.path.join(app.instance_path, 'flaskapp.sqlite'),
=======
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
>>>>>>> 7c91645dfb9cdd53a93f83aa67c818fd032203b5
    )
    app.secret_key = os.environ.get('SECRET_KEY', 'dev')


    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'
    
    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)

<<<<<<< HEAD
    from . import play
    app.register_blueprint(play.bp)

=======
>>>>>>> 7c91645dfb9cdd53a93f83aa67c818fd032203b5
    from . import blog
    app.register_blueprint(blog.bp)
    app.add_url_rule('/', endpoint='index')


    return app