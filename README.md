# A fun puzzle "Server Crush"
## 
By:
Xinyu Wang 23631069
Ke-Cheng Lu 23270983
## 1. Introduction
This game was inspired by a popular mobile game called Puzzle & Dragons.

![](/flaskapp_project2/flaskapp/md_file_images/dragon&puzzle.gif)

This game is very similar to candy crush, or other similar match-of-three games.

![](/flaskapp_project2/flaskapp/md_file_images/candy_crush.jpeg)

However, the only difference between this game and other match-of-three games is that this game does not restrict you from moving the tile 1 block away from its original position. Instead, you can move your selected tile anywhere you want in the box. During your move, the tile you moved will automatically swap the position with the tile on that direction of the movement. Therefore, you can create as many as combo as possible.
The score board of the game will record the tile you eliminated and the max combo you made.
Have a try! You can also save you result on your desktop for you to share it with your friends!


## 2. Rules
2.1.  Moving a tile counts as one round.

![](/flaskapp_project2/flaskapp/md_file_images/movedemo.gif)

2.2. You can move tiles as far as you want; the only limitation is a time limit of 8 seconds. Before moving a tile, you can think as long as you want (even closing the app and coming back later). As soon as you begin moving, the timer will count down, and you must finish your move within 8 seconds.

![](/flaskapp_project2/flaskapp/md_file_images/timedemo.gif)

2.3. When you move a tile, it will swap positions with the tile it moves toward, just like in traditional match-three games. However, in this game you can move as far as you want instead of being limited to one square, so you can drag your tile all over the board to create multiple matches.
2.4. Tiles can be swapped diagonally, but it's difficult to pull off. It's easier on larger screens, but still very touchy.

2.5. Matching rules are the same as in other match-three games. Any 3-in-a-row tiles of the same colour will disappear. The more tiles you clear at once, the higher the combo and score caused.

![](/flaskapp_project2/flaskapp/md_file_images/combodemo.gif)

2.6. After 3 rounds, you can choose to share your score to the score board by clicking the share button. Your play result will be downloaded as PNG image. So you can save the result and share with your friends.  


## 3. Get started

3.1. Follow the requirements.txt file to prepare the virtual environment.

3.2. in the directory above the flask application folder run the following code:

`export FLASK_APP=flaskr`

`flask init-db`

`flask run`

3.3. Then, you can go to your loopback address with port number 5000 from your browser to play with it..


## 4. Debugging & testing
4.1. If you wish to debug the program or check how it works, you can run the following code:

4.2. To start debugging (the admin pass is admin -an absolutely bad password.):

`export FLASK_APP=flaskr`

`export FLASK_ENV=development`

`flask init-db-test`

`flask run`

4.3. The package also contains test files, you will find it in the root\test folder.

## 5. Structure
5.1. Everything related to the game are stored in /static/playcore/ folder.

5.2. python files are:

5.2.1. __init__.py

	This is the basement of this flask app, containing blueprints for all pages. The SECRET_KEY is stored separately in config.py file for extra security.

5.2.2. auth.py

	This file adds routes for login, register, logout, upgrade user, and others.

5.2.3. db.py

	This initialises the database for storing user, account, and puzzle details. In additional to that, the init-db_test command will generate 20 users and 40 results randomly for debugging purpose.

	5.2.3.1. Table Structure

![](/flaskapp_project2/flaskapp/md_file_images/table.png)

5.2.4. play.py

	This python file composes the majority functions of the app, including functions for puzzles, scoreboard, user manage.

5.2.5. templates

	5.2.5.1. base.html

		Defines the master page of the flask app, including scripts, and styles.

	5.2.5.2. auth

		5.2.5.2.1. login.html

		5.2.5.2.2. login.html

	5.2.5.3. play

		5.2.5.3.1. edit.html

		5.2.5.3.2. manage.html

		5.2.5.3.3. play.html

		5.2.5.3.4. rules.html

		5.2.5.3.5. score.html

5.2.6. static

	The folder contains all relatively static files such as pictures, style, js, and  the game core package.

	5.2.6.1. css

		Containing css file, icons, and pictures.

	5.2.6.2. playcore

		The puzzle module.


## 6. Functions and Features
6.1. The original game source code is created by mrmu. Link is here: https://github.com/mrmu/tos_puzzle_js

6.2. The flask app is created by blueprint.

6.3. The app comes with user system, admin system( allow admins to change user account type, delete user accounts, edit puzzle, save puzzle for later updates.)

6.4. The scoreboard function records previous plays’ results, including username, score, max combo, and the date (shared by users to the public). Moreover, when an admin accesses this page, the scoreboard page becomes an activity log, It displays not only user shared scores, but also the unshared scores which are generated automatically after a game finished. An admin can also add a play record to a selected user manually (for testing purpose.)

6.5. The app allows user to download their result to their devices. So they can share the result with their friends.

6.6. UI design including the play area icons are refined based on the course theme.
