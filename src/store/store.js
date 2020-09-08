import { createStore,combineReducers,compose,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import zyContractData from './reducers/zyContractData';
import zyCounter from './reducers/zyCounter'

const rootStore = combineReducers({
    zyContractData,
    zyCounter
})

export default createStore(rootStore,compose(applyMiddleware(...[thunk])));
