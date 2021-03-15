import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import ShowSquare from './Square';
import { CheckEnd } from './EndCheck';
import Leading from './Leaderboard';
import './Board.css';

const socket = io();
function DispBoard() {
  let marker = '';
  let endMessage = '';
  const [endMes, setEnd] = useState('');
  const [board, setBoard] = useState([
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
  ]);
  const [turn, setTurn] = useState(0);
  const [Win, setWin] = useState(0); // 1 is a win, -1 is draw.
  const inputRef = useRef(null);
  const [Users, setUsers] = useState([]);
  const [ShowDB, SetShow] = useState(false);
  const [Leaderboard, setLead] = useState([]);
  // index 0 and 1 are player 1 and player 2, turns can alternate by doing a modulo 2 op
  const [userlogged, setlog] = useState(false); // if this is false that means no one logged in.
  let clientName;
  const [Player, setPlayer] = useState('');

  function ShowLeader() {
    SetShow((PrevShow) => !PrevShow);
  }

  function Logged() {
    console.log('In logged function');
    if (inputRef != null && !userlogged) {
      const username = inputRef.current.value;
      clientName = username;
      setlog(true);
      setPlayer(username);
      console.log(`Is user now: ${userlogged}`);
      console.log(`username: ${username}`);
      console.log('Now emitting to socket, username');
      socket.emit('login', { user: username });
    }
    console.log(`Client name is: ${clientName}`);
  }

  function ReRes() {
    socket.emit('end', { Cond: -2, player: Player });
    window.location.reload(false);
  }

  function BoxClicked(value) {
    console.log(`${value} Button clicked`);
    console.log(`Turn in funct is: ${turn}`);
    if (board[value] !== ' ') {
      console.log(
        'Uh oh. Stinky. Someone tried to reclick/overwrite. No no no. Try again babe.',
      );
      return;
    }
    if (Win === 1) {
      console.log('Someone won. Terminating function.');
      return;
    }
    if (Win === -1) {
      console.log('Draw. Terminating function.');
      return;
    }
    console.log(turn);
    if (turn % 2 === 1 && Player === Users[1]) {
      marker = 'O';
    } else if (turn % 2 === 0 && Player === Users[0]) {
      marker = 'X';
    } else {
      console.log('AINT YOUR TURN HOMEY');
      return;
    }
    setTurn(turn + 1);
    console.log(turn);
    console.log(marker);
    setBoard((prevboard) => {
      const arr = [...prevboard];
      arr[value] = marker;
      console.log(arr);
      return arr;
    });

    // add function here to do checks
    // CheckEnd(value,marker);
    const checkcond = CheckEnd(value, marker, board);
    console.log(`Check result is: ${checkcond}`);
    setWin(checkcond);
    console.log(`Win condition is: ${Win}`);
    // check the win condition to  format message.
    if (checkcond === 1) {
      endMessage = `${Player} has won. Please restart the game to continue playing.`;
      setEnd(endMessage);
      console.log('Win. clearing list.');
      socket.emit('end', { Cond: checkcond, player: Player });
    } else if (checkcond === -1) {
      endMessage = 'A draw has been decided. Please restart the game to continue playing.';
      setEnd(endMessage);
      console.log('Draw. clearing list.');

      socket.emit('end', { Cond: checkcond, player: Player });
    }

    const indval = value;
    console.log(`Emitting: ${indval} | ${board[indval]}`);
    socket.emit('cell', {
      pos: indval,
      bcell: marker,
      upd_tur: turn + 1,
      end: 0 + checkcond,
      e_mes: endMessage,
    });
    console.log('Data emitted.');
  }

  useEffect(() => {
    socket.on(
      'login',
      (usertypes) => {
        console.log('Login data recieved');
        console.log(usertypes);
        setUsers(usertypes.lst);
        console.log(`User type length is: ${usertypes.length}`);
        console.log(Users);
        console.log(Users.length);
        if (usertypes.flag === 1) {
          setLead(usertypes.names);
        }
      },
      [],
    );

    socket.on(
      'leaderboard',
      (data) => {
        console.log('In lead board.');
        console.log(data);
        setLead(data.names);
      },
      [],
    );
    socket.on(
      'upd_l',
      (data) => {
        console.log('In lead board.');
        console.log(data);
        setLead(data.names);
      },
      [],
    );

    // update board
    socket.on('cell', (data) => {
      console.log('cell Data recieved!');
      console.log(data);
      setBoard((prevboard) => {
        const arr = [...prevboard];
        console.log('Making board');
        arr[data.pos] = data.bcell;
        return arr;
      });
      setTurn(data.upd_tur);
      setWin(data.end);
      setEnd(data.e_mes);
      endMessage = data.e_mes;
      console.log(`upd: Turn is ${turn}`);
    });
  }, []);

  console.log(`EEE${endMessage}`);
  return (
    <div>
      Enter Username:
      {' '}
      <input ref={inputRef} type="text" />
      <button type="button" onClick={Logged}>Login</button>
      <div>
        <ul>
          {' '}
          {Users.map((uses, index) => (
            <li>
              {uses}
              {' '}
            </li>
          ))}
          {' '}
        </ul>
      </div>
      {userlogged === true ? (
        <div className="board">
          {board.map((cellval, index) => (
            <ShowSquare Clickbox={BoxClicked} val={index} cell={cellval} />
          ))}
        </div>
      ) : null}
      <p>
        <br />
        {endMes}
        {' '}
      </p>
      <button type="button" onClick={() => ReRes()}>
        Click to restart game (warning, all users will need to refresh if they
        want to keep watching/playing)!
      </button>
      <button type="button" onClick={() => ShowLeader()}> Show/Hide Leaderboard </button>
      {ShowDB === true ? (
        <div>
          <ul>
            {Leaderboard.map((person, index) => (
              <Leading key={index} name={person} />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default DispBoard;
