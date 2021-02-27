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
  const [turn,setTurn] = useState(0);
  const [stroke, setStroke] = useState(0) //logic is that every 3 clicks there is a probability of a winning move
  const [Win,setWin] = useState(0); //1 is a win, -1 is draw.
  
  function CheckEnd(last_ind,marker){ //will use this for a win condition/draw condition
    console.log("Entering check "+last_ind+"="+marker);
    let fillcount = 0;
    let i = 0;
    if (last_ind == 0 || last_ind == 3 || last_ind == 6){
      if (board[last_ind+1] == marker && board[last_ind+2] == marker){
        console.log("We have a winner!");
      }
      if(last_ind == 0){
        if ((board[last_ind+4] == marker && board[last_ind+8] == marker) || (board[3] == marker && board[6] == marker)){
          console.log("We have a winner!");
        }
      }
      else if (last_ind == 3){
        if (board[0] == marker && board[6] == marker){
          console.log("We have a winner!");
        }
      }
      
      else if ((board[3] == marker && board[0] == marker) || (board[4] == marker && board[2] == marker)){
        console.log("We have a winner!");
      }
     
    }
    else if (last_ind == 1 || last_ind == 4 || last_ind == 7){
      if (board[last_ind-1] == marker && board[last_ind+1] == marker){
        console.log("We have a winner!")
        }
      else if (last_ind == 4){
        if ((board[0] == marker && board[8] == marker) || (board[2] == marker && board[6] == marker)){
          console.log("We have a winner!")
        }
      }
    }
    else if (last_ind == 2 || last_ind == 5 || last_ind == 8){
      if (board[last_ind-1] == marker && board[last_ind-2] == marker){
        console.log("We have a winner!");
      }
      else if (last_ind == 2){
        if ((board[4] == marker && board[6] == marker) || (board[5]==marker && board[8] == marker )){
          console.log("We have a winner");
        }
      }
       else if (last_ind == 8){
         if ((board[4] == marker && board[0] == marker) || (board[5]==marker && board[2] == marker )){
          console.log("We have a winner");
        }
         
       }
      
    }
    
  for(i=0; i<9;i++){
      if (board[i] !=" " || i == last_ind){
        fillcount+=1;
      }
    }
    if (fillcount==9){
      console.log("Draw!");
      }      
        
  }
  
    
  
  
  
  
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
    CheckEnd(value,marker);
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



