import string
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, Response
)
from werkzeug.security import check_password_hash, generate_password_hash


from werkzeug.exceptions import abort

from flaskapp.auth import login_required
from flaskapp.db import get_db
import json
import time
from urllib.parse import unquote

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

@bp.route('/play')
@login_required
def play():

    iframe = url_for('static', filename='playcore/puzzle.html')
    loaddata_clrs = [['b', 'b', 'r', 'r', 'b', 'b'], ['y', 'y', 'b', 'b', 'y', 'y'], [
        'p', 'p', 'y', 'y', 'p', 'p'], ['g', 'g', 'r', 'r', 'g', 'g'], ['r', 'r', 'b', 'b', 'r', 'r']]
    def_clrs = ['r', 'g', 'b', 'p', 'p', 'p', 'p', 'y']
  
    return render_template('play/play.html', iframe=iframe, loaddata_clrs=loaddata_clrs, def_clrs=def_clrs)

@bp.route('/rules')
def rules():

    return render_template('play/rules.html')

@bp.route('/restart')
def restart():

    return redirect(url_for("play.play"))



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
        'SELECT s.id, maxcombo, score, created, player_id, username'
        ' FROM score s JOIN user u ON s.player_id = u.id'
        ' ORDER BY score DESC'
    ).fetchall()

    users = db.execute(
        'SELECT id, username, isadmin'
        ' FROM user '
        ' ORDER BY id DESC'
    ).fetchall()
    if request.method == 'POST':
        score = request.form['score']
        maxcombo = request.form['maxcombo']
        playerid = request.form['playerid']
        error = None

        if not score:
            error = 'Score is required.'
        elif not maxcombo:
            error = 'Maxcombo is required.'
        elif not playerid:
            error = 'Player is required.'

        if error is None:
            try:
                db.execute(
                    "INSERT INTO score (player_id, maxcombo, score) VALUES (?, ?, ?)",
                    (playerid, maxcombo, score)
                )
                db.commit()
            except db.IntegrityError:
                error = f"User {playerid} is not exist."
            else:
                return redirect(url_for("play.score"))

        flash(error)


    return render_template('play/score.html', scores=scores, users=users)



@bp.route('/scoreAdd', methods=('GET', 'POST'))
@login_required
def scoreAdd():

    db = get_db()
 
    jsondata = unquote(request.data.decode("utf-8")).split('=')[1]
    if request.method == 'POST':
        data = json.loads(jsondata)
        score = data.get('score')
        maxcombo = data.get('maxcombo')
        playerid = data.get('playerid')
        error = None

        if not score:
            error = 'Score is required.'
        elif not maxcombo:
            error = 'Maxcombo is required.'
        elif not playerid:
            error = 'Player is required.'

        if error is None:
            try:
                print("INSERT INTO score (player_id, maxcombo, score) VALUES (?, ?, ?)",(playerid, maxcombo, score))
                db.execute(
                    "INSERT INTO score (player_id, maxcombo, score) VALUES (?, ?, ?)",
                    (playerid, maxcombo, score)
                )
                db.commit()
            except Exception as e:
                print(e)
            else:
                return  "Success"

        flash(error)


    return 


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
    return redirect(url_for('play.manage'))


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
    return redirect(url_for('play.manage'))

