
import './App.css';
import GetPosts from './components/GetPosts';
import Edit from './components/Edit'
import {
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>

        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <GetPosts />
          </Route>
          <Route path="/edit/:id" component={Edit}/>
        </Switch>
      </div>


  );
}

export default App;
