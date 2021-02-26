import './Board.css'
export function ShowSquare(props){
    console.log(props.val + "|"+props.cell);
    return (<div class="box" onClick={()=>props.Clickbox(props.val) }> { props.cell } </div>)
}