from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, Response
)
from werkzeug.security import check_password_hash, generate_password_hash


from werkzeug.exceptions import abort

from flaskapp.auth import login_required
from flaskapp.db import get_db

import time


bp = Blueprint('play', __name__)


def get_user(id):
    user = get_db().execute(
        'SELECT id, username, isadmin'
        ' FROM user '
        ' WHERE id = ?',
        (id,)
    ).fetchone()

    if user is None:
        abort(404, f"User id {id} doesn't exist.")

    return user


# render the content a url differnt from index. This will be streamed into the iframe
@bp.route('/countdown')
def countdown():
    def timer(t):
        for i in range(t):
            time.sleep(5)  # put 60 here if you want to have seconds
            yield str(i)
    # at the moment the time value is hardcoded in the function just for simplicity
    return Response(timer(10), mimetype='text/html')


@bp.route('/play')
@login_required
def play():

    iframe = url_for('static', filename='playcore/puzzle.html')
    loaddata_clrs = [['b', 'b', 'r', 'r', 'b', 'b'], ['y', 'y', 'b', 'b', 'y', 'y'], [
        'p', 'p', 'y', 'y', 'p', 'p'], ['g', 'g', 'r', 'r', 'g', 'g'], ['r', 'r', 'b', 'b', 'r', 'r']]
    def_clrs = ['r', 'g', 'b', 'p', 'p', 'p', 'p', 'y']

    return render_template('play/play.html', iframe=iframe, loaddata_clrs=loaddata_clrs, def_clrs=def_clrs)


@bp.route('/edit')
@login_required
def edit():

    iframe = url_for('static', filename='playcore/puzzle_edit.html')
    loaddata_clrs = [['b', 'b', 'r', 'r', 'b', 'b'], ['y', 'y', 'b', 'b', 'y', 'y'], [
        'p', 'p', 'y', 'y', 'p', 'p'], ['g', 'g', 'r', 'r', 'g', 'g'], ['r', 'r', 'b', 'b', 'r', 'r']]
    def_clrs = ['r', 'g', 'b', 'p', 'p', 'p', 'p', 'y']

    return render_template('play/edit.html', iframe=iframe, loaddata_clrs=loaddata_clrs, def_clrs=def_clrs)


@bp.route('/score', methods=('GET', 'POST'))
@login_required
def score():

    db = get_db()
    scores = db.execute(
        'SELECT s.id, maxcombo, score, created, player_id'
        ' FROM score s JOIN user u ON s.player_id = u.id'
        ' ORDER BY score DESC'
    ).fetchall()

    return render_template('play/score.html', scores=scores)


@bp.route('/manage', methods=('GET', 'POST'))
@login_required
def manage():

    db = get_db()
    users = db.execute(
        'SELECT id, username, isadmin'
        ' FROM user '
        ' ORDER BY id DESC'
    ).fetchall()


    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        adminpass = request.form['adminpass']
        default_adminpass = "admin"
        if default_adminpass == adminpass:
            adminpass = 1
        else:
            adminpass = 0
        db = get_db()
        error = None

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'

        if error is None:
            try:
                db.execute(
                    "INSERT INTO user (username, isadmin, password ) VALUES (?, ?, ?)",
                    (username, adminpass, generate_password_hash(password))
                )
                db.commit()
            except db.IntegrityError:
                error = f"User {username} is already registered."
            else:
                return redirect(url_for("play.manage"))

        flash(error)

    return render_template('play/manage.html', users=users)


@bp.route('/<int:id>/delete', methods=('POST',))
@login_required
def delete(id):
    get_user(id)
    db = get_db()
    db.execute('DELETE FROM user WHERE id = ?', (id,))
    db.commit()
    return redirect(url_for('play'))


@bp.route('/<int:id>/changeaccounttype', methods=('POST',))
@login_required
def changeaccounttype(id):
    user = get_user(id)
    if user['isadmin'] == 1:
        adminvalue = 0
    else:
        adminvalue = 1
    db = get_db()
    db.execute(
        'UPDATE user SET isadmin = ?'
        ' WHERE id = ?',
        (adminvalue, id)
    )    
    db.commit()
    return redirect(url_for('play'))

