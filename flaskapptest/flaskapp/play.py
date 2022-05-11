from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from flaskapp.auth import login_required
from flaskapp.db import get_db

bp = Blueprint('play', __name__)

@bp.route('/play')
def index():
    db = get_db()
    posts = db.execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' ORDER BY created DESC'
    ).fetchall()

    iframe = url_for('static', filename='playcore/puzzle.html')
    return render_template('play/play.html', iframe=iframe)
