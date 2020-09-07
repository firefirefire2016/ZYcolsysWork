
const defaultState = {
    list:[],
    page:1,
    limit:0
}

export default (state = defaultState,action)=>{
    switch(action.type){
        case 'GET_ALL':
            console.log(action);
            return {...state};
        default:
            return state;
    }
};