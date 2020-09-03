import { post } from '../utils/request'



export function loginApi(user){
    return post('',user);
}