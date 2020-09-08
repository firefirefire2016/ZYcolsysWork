import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import { HashRouter as Router,Switch,Route,Redirect} from 'react-router-dom';
import "antd/dist/antd.css";
import { Provider } from 'react-redux';
import store from './store/store';
import { mainRoutes } from './routes/routesData';
//import Router from './router';
import * as serviceWorker from './serviceWorker';
import Admin from './admin';


ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path='/' component={Admin}></Route>
        <Route path="/admin" render={routeProps=><Admin {...routeProps} />}></Route>
        {mainRoutes.map(route=>{
          return <Route key={route.path} {...route}></Route>
        })}
        <Redirect to="/noMatch"></Redirect>
      </Switch>
    </Router>
    </Provider>,
  document.getElementById('root')
);

//React.Component.prototype.$config = window.config

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
