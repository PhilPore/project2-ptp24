import './Board.css';
import React from 'react';
import PropTypes from 'prop-types';

function ShowSquare(props) {
  const { val, cell, Clickbox } = props;

  return (
    <div tabIndex="0" className="box" role="button" onClick={() => Clickbox(val)} onKeyPress={() => {}}>
      {' '}
      {cell}
      {' '}
    </div>
  );
}

ShowSquare.propTypes = {
  val: PropTypes.number.isRequired,
  cell: PropTypes.string.isRequired,
  Clickbox: PropTypes.func.isRequired,

};

export default ShowSquare;
