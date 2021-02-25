import './Board.css'
export function ShowSquare(prop){
    console.log(prop.val + "|"+prop.cell);
    return (<div class="box" onClick={()=>prop.Clickbox(prop.val) }> { prop.cell } </div>)
}