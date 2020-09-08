// Action Creator


 export function increaseAction (dispatch,props){
     console.log(props);
    dispatch({ type: 'increase' })
 }