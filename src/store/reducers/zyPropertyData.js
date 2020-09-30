
const defaultState = {
    list: [],
    page: 1,
    limit: 10,
    total: 0
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'BACK_Contract':
            return{
                ...state,
            }
        case 'TO_Contract':
            console.log(action);
            return {
                rightnos:action.payload.rightnos,
                mode:'creating',
            };
        case 'LOADING':
            return{
                isLoading:true,
            };
        case 'GET_ALL':
            //console.log(action);
            return {
                ...state,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                rightnos: action.payload.rows,
               // selects: action.payload.selects,
                isLoading:false,
                res: null
            };
        case 'COMMIT_CREATE':
            console.log(action);
            return {
                ...state,
                res: action.payload.res,
                mode:'home',
            };
        case 'CREATE_ONE':
            return {
                ...state,
                isCreating: true,
                mode:'creating',
            };
        case 'GET_ONEDETAIL':
            console.log(action);
            return {
                ...state,
                record: action.payload.record,
                id: action.payload.id,
                isCreating: false,
                mode: action.payload.mode,
            };
        case 'COMMIT_Edit':
            console.log(action);
            return {
                ...state,
                res: action.payload.res,
                mode:'home',
            };
        
        default:
            return state;
    }
};