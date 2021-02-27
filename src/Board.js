import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { ShowSquare } from './Square.js'
import { CheckEnd } from './EndCheck.js'
import './Board.css'
var turns = 0;
const socket = io()
export function DispBoard () {
  var turns = 0;
  var marker = '';
  
  const [board,setBoard] = useState([" "," "," "," "," "," "," "," "," "]);
  const [turn,setTurn] = useState(0);
  const [stroke, setStroke] = useState(0) //logic is that every 3 clicks there is a probability of a winning move
  const [Win,setWin] = useState(0); //1 is a win, -1 is draw.
  
  
  
  
  
  function BoxClicked(value){
    console.log(value + " Button clicked");
    console.log("Turn in funct is: "+turn)
    
    console.log(turn);
    if (turn%2 === 1){
    marker = 'O';
    }
    else{
    marker='X';
    }
  setTurn(turn+1);
  console.log(turn);
  console.log(marker);
    setBoard(prevboard=>{
      const arr = [...prevboard];
      arr[value] = marker;
      console.log(arr)
     return arr;
    });
    
    //add function here to do checks
    //CheckEnd(value,marker);
    CheckEnd(value,marker,board);
    const ind_val = value;
    console.log("Emitting: "+ ind_val+" | "+board[ind_val]);
    socket.emit('cell',{pos:ind_val,bcell:marker,upd_tur:turn+1 });
    console.log("Data emitted.");
    

  }
  
  useEffect(() => {
    socket.on('cell', (data) => {
      console.log("cell Data recieved!");
      console.log(data);
      setBoard(prevboard=>{
      const arr = [...prevboard];
      console.log("Making board");
      arr[data.pos] = data.bcell;
     return arr;
    });
    setTurn(data.upd_tur);
    console.log("upd: Turn is "+turn);
    });
  });
  
    return (
  <div class="board">
  {board.map((cellval,index)=>
    <ShowSquare Clickbox={BoxClicked} val={index} cell = {cellval}  />
  )}
  
  
    </div>);
}



