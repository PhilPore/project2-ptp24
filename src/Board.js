import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import ShowSquare from './Square.js';
import { CheckEnd } from './EndCheck.js';
import Leading from './Leaderboard.js';
import './Board.css';

const socket = io();
export function DispBoard() {
  let marker = '';
  let end_message = '';
  const [end_mes, set_end] = useState('');
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
  const [LeadScores, setScores] = useState([]);

  // index 0 and 1 are player 1 and player 2, turns can alternate by doing a modulo 2 op
  const [user_logged, set_log] = useState(false); // if this is false that means no one logged in.
  let Client_Name;
  const [Player, setPlayer] = useState('');

  function ShowLeader() {
    SetShow((PrevShow) => !PrevShow);
  }

  function Logged() {
    console.log('In logged function');
    if (inputRef != null && !user_logged) {
      const username = inputRef.current.value;
      Client_Name = username;
      set_log((prevlog) => true);
      setPlayer(username);
      console.log(`Is user now: ${user_logged}`);
      console.log(`username: ${username}`);
      console.log('Now emitting to socket, username');
      socket.emit('login', { user: username });
    }
    console.log(`Client name is: ${Client_Name}`);
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
    } if (Win === -1) {
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
      end_message = `${Player} has won. Please restart the game to continue playing.`;
      set_end(end_message);
      console.log('Win. clearing list.');
      socket.emit('end', { Cond: checkcond, player: Player });
    } else if (checkcond === -1) {
      end_message = 'A draw has been decided. Please restart the game to continue playing.';
      set_end(end_message);
      console.log('Draw. clearing list.');

      socket.emit('end', { Cond: checkcond, player: Player });
    }

    const ind_val = value;
    console.log(`Emitting: ${ind_val} | ${board[ind_val]}`);
    socket.emit('cell', {
      pos: ind_val,
      bcell: marker,
      upd_tur: turn + 1,
      end: 0 + checkcond,
      e_mes: end_message,
    });
    console.log('Data emitted.');
  }

  useEffect(() => {
    socket.on(
      'login',
      (user_types) => {
        console.log('Login data recieved');
        console.log(user_types);
        setUsers(user_types.lst);
        console.log(`User type length is: ${user_types.length}`);
        console.log(Users);
        console.log(Users.length);
        if (user_types.flag === 1) {
          setLead(user_types.names);
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
      set_end(data.e_mes);
      end_message = data.e_mes;
      console.log(`upd: Turn is ${turn}`);
    });
  }, []);

  console.log(`EEE${end_message}`);
  return (
    <div>
      Enter Username:
      {' '}
      <input ref={inputRef} type="text" />
      <button onClick={Logged}>Login</button>
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
      {user_logged === true ? (
        <div className="board">
          {board.map((cellval, index) => (
            <ShowSquare Clickbox={BoxClicked} val={index} cell={cellval} />
          ))}
        </div>
      ) : null}
      <p>
        <br />
        {end_mes}
        {' '}
      </p>
      <button onClick={() => ReRes()}>
        Click to restart game (warning, all users will need to refresh if they
        want to keep watching/playing)!
      </button>
      <button onClick={() => ShowLeader()}> Show/Hide Leaderboard </button>
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
