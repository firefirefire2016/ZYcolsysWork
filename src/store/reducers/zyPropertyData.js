
const defaultState = {
    list: [],
    page: 1,
    limit: 10,
    total: 0
}

export default (state = defaultState, action) => {
    switch (action.type) { 
        case 'selectmode_NULL':
            return{
                selectmode:null,
                rightno:null,
            };
        case 'TO_PROPERTY':
            console.log(action.type);
            return {
                selectmode:'toselect',
                rightno:action.payload.rightno,
            };
        case 'TO_Contract':
            console.log(action.type);
            return {
                ...state,
                rightno:action.payload.rightno,
                selectmode:'backcontract',
            };        
        case 'LOADINGRight':
            return{
                ...state,
                isLoading:true,
            };
        case 'GET_ALLRight':
            return {
                ...state,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                rightno: action.payload.rightno,
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
               // isCreating: false,
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