import { createStore,combineReducers,compose,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import zyContractData from './reducers/zyContractData';
import zyCounter from './reducers/zyCounter'
import zyCollectionData from './reducers/zyCollectionData'
import zyPropertyData from './reducers/zyPropertyData'
import zyRentlistData from './reducers/zyRentlistData'

const rootStore = combineReducers({
    zyContractData,
    zyCounter,
    zyCollectionData,
    zyPropertyData,
    zyRentlistData
})

export default createStore(rootStore,compose(applyMiddleware(...[thunk])));
