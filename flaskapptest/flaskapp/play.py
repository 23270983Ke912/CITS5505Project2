from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, Response
)

from werkzeug.exceptions import abort

from flaskapp.auth import login_required
from flaskapp.db import get_db

import time


bp = Blueprint('play', __name__)

@bp.route('/countdown') # render the content a url differnt from index. This will be streamed into the iframe
def countdown():
    def timer(t):
        for i in range(t):
            time.sleep(5) #put 60 here if you want to have seconds
            yield str(i)
    return Response(timer(10), mimetype='text/html') #at the moment the time value is hardcoded in the function just for simplicity

@bp.route('/play')
@login_required 
def play():

    iframe = url_for('static', filename='playcore/puzzle.html')
    loaddata_clrs = [['g','g','r','r','b','b'],['y','y','b','b','y','y'],['p','p','y','y','p','p'],['g','g','r','r','g','g'],['r','r','b','b','r','r']]
    def_clrs = ['r','g','b','p','p','p','p','y']

    return render_template('play/play.html', iframe=iframe,loaddata_clrs=loaddata_clrs ,def_clrs=def_clrs)

@bp.route('/edit')
@login_required 
def edit():

    iframe = url_for('static', filename='playcore/puzzle_edit.html')
    loaddata_clrs = [['b','b','r','r','b','b'],['y','y','b','b','y','y'],['p','p','y','y','p','p'],['g','g','r','r','g','g'],['r','r','b','b','r','r']]
    def_clrs = ['r','g','b','p','p','p','p','y']

    return render_template('play/edit.html', iframe=iframe,loaddata_clrs=loaddata_clrs ,def_clrs=def_clrs)

@bp.route('/score', methods=('GET', 'POST'))
@login_required
def score():
    
    db = get_db()
    scores = db.execute(
        'SELECT s.id, maxcombo, score, created, player_id, username'
        ' FROM score s JOIN user u ON s.player_id = u.id'
        ' ORDER BY score DESC'
    ).fetchall()

    return render_template('play/score.html', scores=scores)