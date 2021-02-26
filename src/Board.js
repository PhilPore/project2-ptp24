import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { ShowSquare } from './Square.js'
import './Board.css'
var turns = 0;
const socket = io()
export function DispBoard () {
  var turns = 0;
  var marker = '';
  
  const [board,setBoard] = useState([" "," "," "," "," "," "," "," "," "]);
  function BoxClicked(value){
    console.log(value + " Button clicked");
    
    
    console.log(turns);
    if (turns%2 === 1){
    marker = 'O';
    }
    else{
    marker='X';
    }
  console.log(marker);
    setBoard(prevboard=>{
      const arr = [...prevboard];
      arr[value] = marker;
      /*if (prevboard[value] != "X"){
        arr[value] = "X";
        
      }
      else {
        arr[value] = " ";
        
      }*/
      console.log(arr)
     return arr;
    });
    const ind_val = value;
    console.log("Emitting: "+ ind_val+" | "+board[ind_val]);
    socket.emit('cell',{pos:ind_val,bcell:marker });
    console.log("Data emitted.");
  }
  
  useEffect(() => {
    turns = turns+1;
    socket.on('cell', (data) => {
      console.log("cell Data recieved!");
      console.log(data);
      setBoard(prevboard=>{
      const arr = [...prevboard];
      console.log("Making board");
      arr[data.pos] = data.bcell;
     return arr;
    });
    });
  });
  
    return (
  <div class="board">
  {board.map((cellval,index)=>
    <ShowSquare Clickbox={BoxClicked} val={index} cell = {cellval}  />
  )}
  
  
    </div>);
}



