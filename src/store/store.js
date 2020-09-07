import { createStore,combineReducers,compose,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import zyContractData from './reducers/zyContractData';

const rootRouter = combineReducers({
    zyContractData
})

export default createStore(rootRouter,compose(applyMiddleware(...[thunk])));
