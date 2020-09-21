import { createStore,combineReducers,compose,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import zyContractData from './reducers/zyContractData';
import zyCounter from './reducers/zyCounter'
import zyCollectionData from './reducers/zyCollectionData'
import zyPropertyData from './reducers/zyPropertyData'

const rootStore = combineReducers({
    zyContractData,
    zyCounter,
    zyCollectionData,
    zyPropertyData
})

export default createStore(rootStore,compose(applyMiddleware(...[thunk])));
