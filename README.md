# Tic. Tac. Toe.

## Requirements
Upon Cloning, one needs to to do a couple of installs. 
1. `pip install flask-socketio`
2. `pip install flask-cors`
3. `pip install flask (if you havent already please got tell me you installed. Please GOD TELL ME YOU HAVE MAN)`
4. `npm install`
5. `npm install socket.io-client --save`

Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory



## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run `npm run start` after cding into project directory. 

## Known Problem:
* List of individuals is displayed before someone logs in. This is due to JSX elements being very whiney when it comes to things being next to them. Will look into ways of handling this.
* List of users will not clear, requires the server to be rebooted to do so. This can be solved via having an emit after a restart. This will clear the list and allow the users to log in normally.

## To add:
* An alert when either someone joins in, or when it is someone's turn. I think that appease most people who don't know if they're going or not. 
* An alert when someone does something they shouldn't. It'd be cute to scare them.
* Make everything pretty. It's pretty blank right now but it is what it is. 

## Technical issues and how I proved I was smarter than a fifth grader.
1. I was having issues with my states. Something was not updating when I was doing checks on it. Turns out it was, but the way states seem to work involves you getting access to a previous record of the state in question. To circumvent this, I had to use temporary variables to pass data along ,especially to my sockets (this being evident by turns and what I use for my conditionals)
2. Passing in a user list and doing turns was a bit of a doozy, I was initially tinkering with the idea of doing a detailed dictionary that defines player x, o and the spectators and to determine if it was your turn was by checking if x or o was previously used. I opted for a different, and more efficient route. Using my `turn` use state, and knowing that player 1 and 2 will always be the 0th and 1st element of my array; I saved the person's user as a global variable, and used modular arithmetic of base 2 to cycle through their turns. Pretty neat huh?
 
