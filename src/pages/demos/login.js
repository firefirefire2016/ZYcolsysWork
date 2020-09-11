import React, { useEffect, useState } from 'react'
import { Link,useHistory} from 'react-router-dom'
import {Form,Input,Button, Alert} from 'antd'

import './App.scss'
import axios from 'axios'

const FormItem = Form.Item


export default function Login(){

    const [name,setName] = useState('');

    const [password,SetPwd] = useState('');

    const history = useHistory();

    function loginClick(name,pwd){
        console.log('尝试登录！');
        return axios.get('/login.json',{
            params:{
                name,pwd
            }
        })
    }

    return <Form className='login-form'>
        <h1 className='h1' >正圆资产管理系统</h1>
        <FormItem>
            <Input placeholder='请输入用户名' maxLength={8} onChange={(event)=>{
                    setName(event.target.value);
            }}/>
        </FormItem>
        <FormItem>
            <Input placeholder='请输入密码' maxLength={10} type='password' onChange={(event)=>{
                    SetPwd(event.target.value);
            }}/>
        </FormItem>
        <label>{name}-------{password}</label>
        <FormItem>
            <Button type='primary' onClick={()=>{
                loginClick(name,password).then((response)=>{
                    let res = response.data;
                    if(res.code === 0 && name ==='admin' && password ==='admin'){
                        history.push('/home');
                    }
                    else{
                        alert('账号或密码错误!');
                    }
                 }
                )
            }}>登录</Button>
        </FormItem>
    </Form>
}

