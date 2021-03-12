import './Board.css';

function ShowSquare(props) {
  const { val, cell } = props;
  
  return (
    <div className="box" onClick={() => props.Clickbox(val)}>
      {' '}
      {cell}
      {' '}
    </div>
  );
}

export default ShowSquare;
