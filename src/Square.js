import './Board.css';

function ShowSquare(props) {
  const { val, cell, Clickbox } = props;

  return (
    <div className="box" role="switch" onClick={() => Clickbox(val)}>
      {' '}
      {cell}
      {' '}
    </div>
  );
}

export default ShowSquare;
