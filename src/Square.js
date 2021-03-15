import './Board.css';
import React from 'react';

function ShowSquare(props) {
  const { val, cell, Clickbox } = props;

  return (
    <div className="box" onClick={() => Clickbox(val)}>
      {' '}
      {cell}
      {' '}
    </div>
  );
}

export default ShowSquare;
