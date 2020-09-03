import React  from 'react'
import { Switch,Route,Redirect} from 'react-router-dom';
import {  admins } from './routes/routesData';
import Frame from './components/Frame/adminFrame';
import './admin.scss';


function admin() {
    return (
        <Frame>
            <Switch>
            {admins.map(route=>{
                return(
                    <Route key={route.path} 
                        path={route.path} 
                        exact={route.exact} 
                        render={routePs=>{
                            return <route.component {...routePs}/>;
                        }
                        }
                        
                    />
                    
                )
            })}
            {admins.map(route=>{
                return(route.children.map(child=>{
                    return(
                        <Route key={child.path} 
                            path={child.path} 
                            exact={child.exact} 
                            render={routePs=>{
                                return <child.component {...routePs}/>;
                            }
                            }
                            
                        />
                        
                        )
                    })
                    
                )
            })}
            

            <Redirect to="/noMatch"></Redirect>
            </Switch>
        </Frame>
    )
}

export default admin
