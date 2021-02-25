import React, { useState, useRef } from 'react';
import { ShowSquare } from './Square.js'
import './Board.css'

export function DispBoard () {
  
  const [board,setBoard] = useState([" "," "," "," "," "," "," "," "," "]);
  function BoxClicked(value){
    console.log(value + " Button clicked");
    
    setBoard(prevboard=>{
      const arr = [...prevboard];
      if (prevboard[value] != "X"){
        arr[value] = "X"
      }
      else {
        arr[value] = " "
      }
     return arr
    });
  
  }
    return (
  <div class="board">
  {board.map((cellval,index)=>
    <ShowSquare Clickbox={BoxClicked} val={index} cell = {cellval}  />
  )}
  
  
    </div>);
}



