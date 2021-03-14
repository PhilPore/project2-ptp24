'''Server for the tic tac toe. Handles DB/Users, Turns, and Sockets'''
import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import models

load_dotenv(find_dotenv())

USER_TYPES = []  #user list

app = Flask(__name__, static_folder='./build/static')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
#import models
db.create_all()
#models.Person.query.all()

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(app,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
#Returns the site name. Simple.
def index(filename):
    '''Index return'''
    return send_from_directory('./build', filename)

def updt(leadboard):
    '''Returns the new db list!'''
    temp_arr = []
    for pers in leadboard:
        temp_arr.append([pers.username, pers.score])
    return temp_arr
# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    '''User is connected and leaderboard is generated.'''
    print('User connected!')
    print("Printing list")
    leaderboard = db.session.query(models.Person).order_by(
        models.Person.score.desc())
    leadlist_name = updt(leaderboard)
    #for pers in leaderboard:
        #leadlist_name.append([pers.username, pers.score])
        #leadlist_score.append([pers.score])
    #print("{}\n{}".format(leadlist_name,leadlist_score))
    socketio.emit('leaderboard', {"names": leadlist_name})
    


# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    '''On user disconnect'''
    print('User disconnected!')

def handle_users(data):
    '''Is my user in my list? I know this can be done via if statement in the function, but gotta bs somehow'''
    return True if data['user'] not in USER_TYPES else False
def add_new_user(data):
    '''adds the new user to the db'''
    new_user = models.Person(username=data['user'], score=100)
    db.session.add(new_user)
    db.session.commit()
    return new_user
@socketio.on('login')
#Append to userlist
def on_log(data):
    '''Allows the user to log in. Puts them in a list.'''
    print(str(data))
    if handle_users(data):
        USER_TYPES.append(data['user'])
    flag = 0
    quer = models.Person.query.filter_by(username=data['user']).first()
    if quer is None:
        flag = 1
        add_new_user(data)
    leaderboard = db.session.query(models.Person).order_by(
        models.Person.score.desc())
    lst_name = []
    for pers in leaderboard:
        lst_name.append([pers.username, pers.score])
    socketio.emit('login', {
        'lst': USER_TYPES,
        'flag': flag,
        'names': lst_name
    },
                  broadcast=True,
                  include_self=True)


# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('cell')
def on_chat(data):  # data is whatever arg you pass in your emit call on client
    '''This updates whenever the user emits. Send to other people connected to update value.'''
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('cell', data, broadcast=True, include_self=False)

def get_indexes(data):
    '''Get the winner and loser index'''
    win_arr = []
    if data["player"] == USER_TYPES[0]:
        win_arr = [0, 1]
    elif data["player"] == USER_TYPES[1]:
        win_arr = [1, 0]
    return win_arr
@socketio.on('end')
def game_over(data):
    '''Kills the game. Sent in by one person'''
    print(str(data))
    if data["Cond"] == 1:
        win_ind = 0
        lose_ind = 1
        arg = get_indexes(data)
        win_ind = arg[0]
        lose_ind = arg[1]
        win_quer = db.session.query(
            models.Person).filter_by(username=USER_TYPES[win_ind]).first()
        win_quer.score = win_quer.score + 1
        db.session.commit()
        lose_quer = db.session.query(
            models.Person).filter_by(username=USER_TYPES[lose_ind]).first()
        lose_quer.score = lose_quer.score - 1
        db.session.commit()
        print(win_quer.score)
        #lose_quer.score = lose_quer.score-1
        print(lose_quer.score)
        #db.session.commit()
        leaderboard = db.session.query(models.Person).order_by(
            models.Person.score.desc())
        leadlist_name = []
        for pers in leaderboard:
            print("{} = {}".format(pers.username, pers.score))
            leadlist_name.append([pers.username, pers.score])
        socketio.emit('upd_l', {'names': leadlist_name},
                      broadcast=True,
                      include_self=True)
    USER_TYPES.clear()
    print("Users cleared.")
    print(USER_TYPES)


if __name__ == "__main__":

    # Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
    