import sqlite3
import random
import click
from flask import current_app, g
from flask.cli import with_appcontext
from werkzeug.security import generate_password_hash



def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


@click.command('init-db-test')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()

    db = get_db()

    for i in range(20):
        username = "user" + str(i)
        password = "pass"

        print("INSERT INTO user (username, isadmin, password ) VALUES (?, ?, ?)",
              username, "", generate_password_hash(password))
        db.execute(
            "INSERT INTO user (username, isadmin, password ) VALUES (?, ?, ?)",
            (username, "", generate_password_hash(password))
        )
        db.commit()

        for n in range(2):
            score = random.randint(2, 16)*10
            maxcombo = random.randint(1, 8)
            playerid = random.randint(1, 20)
            shareable = str(random.randint(0, 1))
            print("INSERT INTO score (player_id, maxcombo, score, shareable) VALUES (?, ?, ?, ?)",
                  playerid, maxcombo, score, shareable)
            db.execute(
                "INSERT INTO score (player_id, maxcombo, score, shareable) VALUES (?, ?, ?, ?)",
                (playerid, maxcombo, score, shareable)
            )
            db.commit()

    click.echo('Initialized the database.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
