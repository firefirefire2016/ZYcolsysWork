
const defaultState = {
    list: [],
    page: 1,
    limit: 10,
    total: 0
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_ALL':
            console.log(action);
            return {
                ...state,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit
            };
        case 'GET_ONE':
            console.log(action);
            return {
                ...state,
                record: action.payload.record,
                isCreating: false,
            };
        case 'CREATE_ONE':
            return {
                ...state,
                isCreating: true,
            };
        case 'COMMIT_CREATE':
            console.log(action);
            return {
                ...state,
                record:action.payload.record,
                res:action.payload.result
            };
        case 'COMMIT_Edit':
            console.log(action);
            return {
                ...state,
                record:action.payload.record,
                res:action.payload.result
            };
        default:
            return state;
    }
};