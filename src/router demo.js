import React from 'react';
//import ReactDOM from 'react-dom';

import { HashRouter as Router , Route,Switch} from 'react-router-dom'; 

import App from './pages/app'
import Login from './pages/login'
import Home from './pages/home'
import EditableTable from './pages/home1'
import NoMatch from './pages/404'
import AddContract from './pages/addContract'
import AddUnit from './pages/addUnit'
import AddUnit1 from './pages/demoadd'


export default function IRouter(){




    return <Router>
        <Switch>
            <Route exact path='/' component={App}></Route>
            <Route path='/login' component={Login}></Route>
            <Route path='/home' component={Home}></Route>
            <Route path='/home1' component={EditableTable}></Route>
            <Route path='/addContract' component={AddContract}></Route>
            <Route path='/addUnit' component={AddUnit}></Route>
            <Route path='/addUnit1' component={AddUnit1}></Route>
            <Route path='/*' component={NoMatch}></Route>
        </Switch>
    </Router>
}