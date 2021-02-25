import logo from './logo.svg';
import './App.css';
import { Listitem } from './listitem.js';
import { DispBoard } from './Board.js';
import './Board.css';
function App() {
  return (
    <div className="App">
      <ul>
      <li> Jo'Mama </li>
      <Listitem myname="Cool kid"/>
      </ul>
      <DispBoard/>
      
    </div>
  );
}

export default App;
