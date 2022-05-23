from email.policy import default
import string
from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, Response
)
from werkzeug.security import generate_password_hash


from werkzeug.exceptions import abort

from flaskapp.auth import login_required
from flaskapp.db import get_db
import json
import time
from datetime import date
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
def load_today_puzzle():
    defaultpuzzle = "'b', 'b', 'r', 'r', 'b', 'b', 'y', 'y', 'b', 'b', 'y', 'y', 'p', 'p', 'y', 'y', 'p', 'p', 'g', 'g', 'r', 'r', 'g', 'g', 'r', 'r', 'b', 'b', 'r', 'r'"
    db = get_db()
    todaydate=date.today().strftime("%Y-%m-%d")
    print(todaydate)
    puzzle = db.execute(
    "SELECT * FROM puzzle WHERE puzzledate = '"+todaydate+"'"
    ).fetchone()
    print(puzzle)
    if puzzle is None:
        print('puzzle is not found')
        return defaultpuzzle
    else:
        print('puzzle found')
        return puzzle['puzzle']
    



@bp.route('/play')
@login_required
def play():
    iframe = url_for('static', filename='playcore/puzzle.html')
    
    loaddata_clrs = load_today_puzzle()

    return render_template('play/play.html', iframe=iframe, loaddata_clrs=loaddata_clrs)

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

    return render_template('play/edit.html', iframe=iframe)


@bp.route('/score', methods=('GET', 'POST'))
@login_required
def score():

    db = get_db()
    scores = db.execute(
        'SELECT s.id, maxcombo, score, created, player_id, username, shareable'
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

        if not score or not score.isnumeric() :
            error = 'Score is required. Or enter a positive number'
        elif not maxcombo or not maxcombo.isnumeric():
            error = 'Maxcombo is required. Or enter a positive number'
        elif not playerid:
            error = 'Player is required.'

        if error is None:
            try:
                db.execute(
                    "INSERT INTO score (player_id, maxcombo, score, shareable) VALUES (?, ?, ?, ?)",
                    (playerid, maxcombo, score, 0)
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
        shareable = data.get('shareable')
        error = None

        if not score:
            error = 'Score is required.'
        elif not maxcombo:
            error = 'Maxcombo is required.'
        elif not playerid:
            error = 'Player is required.'
        elif not shareable:
            error = 'Shareable is required.'

        if error is None:
            try:
                print("INSERT INTO score (player_id, maxcombo, score, shareable) VALUES (?, ?, ?, ?)",(playerid, maxcombo, score, shareable))
                db.execute(
                    "INSERT INTO score (player_id, maxcombo, score, shareable) VALUES (?, ?, ?, ?)",
                    (playerid, maxcombo, score, shareable)
                )
                db.commit()
            except Exception as e:
                print(e)
            else:

                return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 


        flash(error)


    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@bp.route('/editAdd', methods=('GET', 'POST'))
@login_required
def editAdd():

    db = get_db()
 
    jsondata = unquote(request.data.decode("utf-8")).split('=')[1]
    if request.method == 'POST':
        data = json.loads(jsondata)
        puzzle = data.get('puzzle')
        creator_id = data.get('creator_id')
        puzzledate = data.get('puzzledate')
        error = None

        if not creator_id:
            error = 'creator_id is required.'
        elif not puzzle:
            error = 'puzzle is required.'
        elif not puzzledate:
            error = 'puzzledate is required.'
        if error is None:
            try:
                db = get_db()
                print( "SELECT puzzledate FROM puzzle WHERE puzzledate = '"+puzzledate+"'")
                dbpuzzledate = db.execute(
                    "SELECT puzzledate FROM puzzle WHERE puzzledate = '"+puzzledate+"'"
                ).fetchall()
        
                if len(dbpuzzledate)==0:
                    print("INSERT INTO puzzle (creator_id, puzzle, puzzledate) VALUES (?, ?,?)",(creator_id, puzzle,puzzledate))
                    db.execute(
                        "INSERT INTO puzzle (creator_id,puzzle, puzzledate) VALUES (?, ?,?)",
                        (creator_id, puzzle,puzzledate)
                    )
                    db.commit()
                else:
                    print("Puzzle existed")
                    return json.dumps({'success':False}), 405, {'ContentType':'application/json'} 
            except Exception as e:
                print(e)
            else:
                return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

        flash(error)


    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 


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

