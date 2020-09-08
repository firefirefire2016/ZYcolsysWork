
const defaultState = {
    list: [],
    page: 1,
    limit: 3,
    total: 0
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_ALL':
            console.log(action);
            return { ...state, 
                list: action.payload.rows, 
                page: action.payload.page, 
                total: action.payload.total,
                limit: action.payload.limit
             };
        case 'SET_LIMIT': 
             return {
                ...state,
                list: action.payload.rows, 
                page: action.payload.page, 
                total: action.payload.total,
                limit: action.payload.limit
             }
        default:
            return state;
    }
};