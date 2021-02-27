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
  var end_message = "";
  const [end_mes, set_end] = useState("");
  const [board,setBoard] = useState([" "," "," "," "," "," "," "," "," "]);
  const [turn,setTurn] = useState(0);
  const [stroke, setStroke] = useState(0) //logic is that every 3 clicks there is a probability of a winning move
  const [Win,setWin] = useState(0); //1 is a win, -1 is draw.
  
  
  
  
  
  function BoxClicked(value){
    console.log(value + " Button clicked");
    console.log("Turn in funct is: "+turn)
    if (Win == 1){
      console.log("Someone won. Terminating function.");
      return;
    }
    else if (Win == -1){
      console.log("Draw. Terminating function.");
      return;
      
    }
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
    let checkcond = CheckEnd(value,marker,board);
    console.log("Check result is: "+checkcond);
    setWin(checkcond);
    console.log("Win condition is: "+Win);
    // check the win condition to  format message. 
     if (checkcond == 1){
      end_message = "A Winner has been decided. Please restart the game to continue playing."
      set_end(end_message);
    }
    else if (checkcond == -1){
      end_message = "A draw has been decided. Please restart the game to continue playing."
      set_end(end_message);
    }
    
    
    
    const ind_val = value;
    console.log("Emitting: "+ ind_val+" | "+board[ind_val]);
    socket.emit('cell',{pos:ind_val,bcell:marker,upd_tur:turn+1, end:(0+checkcond), e_mes: end_message });
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
    setWin(data.end);
    set_end(data.e_mes);
    end_message = data.e_mes;
    console.log("upd: Turn is "+turn);
    });
  });
    console.log("EEE"+end_message);
    return (
  <div>
  <div class="board">
  {board.map((cellval,index)=>
    <ShowSquare Clickbox={BoxClicked} val={index} cell = {cellval}  />
  )}
    
    </div>
      <p><br/>{end_mes} </p>

    </div>
    
    
    );
  
}



