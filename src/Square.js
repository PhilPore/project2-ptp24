import './Board.css';

export function ShowSquare(props) {
  return (
    <div className="box" onClick={() => props.Clickbox(props.val)}>
      {' '}
      {props.cell}
      {' '}
    </div>
  );
}

export default ShowSquare;
