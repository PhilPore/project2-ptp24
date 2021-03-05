import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv


load_dotenv(find_dotenv())

user_types = [] #user list

app = Flask(__name__, static_folder='./build/static')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models
db.create_all()
#models.Person.query.all()

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
#Returns the site name. Simple.
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')
    print("Printing list")
    leaderboard = db.session.query(models.Person).order_by(models.Person.score.desc())
    leadlist_name = []
    leadlist_score = []
    for pers in leaderboard:
        leadlist_name.append([pers.username,pers.score])
        #leadlist_score.append([pers.score])
    #print("{}\n{}".format(leadlist_name,leadlist_score))
    socketio.emit('leaderboard',{"names":leadlist_name})
    #leaderboard

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

@socketio.on('login')
#Append to userlist
def on_log(data):
    print(str(data))
    if data['user'] not in user_types:
        user_types.append(data['user'])
    flag = 0 
    quer = models.Person.query.filter_by(username=data['user']).first()
    if quer == None:
        flag = 1
        new_user = models.Person(username=data['user'], score=100)
        db.session.add(new_user)
        db.session.commit()
    leaderboard = db.session.query(models.Person).order_by(models.Person.score.desc())
    leadlist_name = []
    for pers in leaderboard:
        leadlist_name.append([pers.username,pers.score])
    
   
    socketio.emit('login', {'lst':user_types, 'flag':flag, 'names':leadlist_name}, broadcast=True, include_self=True)
# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('cell')
def on_chat(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('cell',  data, broadcast=True, include_self=False)

@socketio.on('end')
def game_over(data):
    print(str(data))
    if data["Cond"] == 1:
        win_ind = 0
        loser_ind = 1
        if data["player"] == user_types[0]:
            print("player X")
        elif data["player"] == user_types[1]:
            print("Player O")
            win_ind = 1
            loser_ind = 0
        win_quer = db.session.query(models.Person).filter_by(username=user_types[win_ind]).first()
        win_quer.score = win_quer.score+1
        db.session.commit()
        lose_quer = db.session.query(models.Person).filter_by(username=user_types[loser_ind]).first()
        lose_quer.score = lose_quer.score-1
        db.session.commit()
        print(win_quer.score)
        #lose_quer.score = lose_quer.score-1
        print(lose_quer.score)
        db.session.commit()
        leaderboard = db.session.query(models.Person).order_by(models.Person.score.desc())
        leadlist_name = []
        for pers in leaderboard:
            print("{} = {}".format(pers.username,pers.score))
            leadlist_name.append([pers.username,pers.score])
        socketio.emit('upd_l', {'names':leadlist_name}, broadcast=True, include_self=True)

        
    user_types.clear()
    print("Users cleared.")
    print(user_types)

if __name__ == "__main__":

# Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
