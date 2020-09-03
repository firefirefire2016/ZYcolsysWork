import React, { useState, useEffect } from 'react'
import { Link} from 'react-router-dom'; 
import './App.scss'
import 'antd/dist/antd.css'

export default function Login(){

    const [count,SetCount] = useState(10);

    useEffect(()=>{
        console.log('执行了useEffect...')
        SetCount(100);
    },[])

    return     <div className='container'>
        <h1>欢迎进入正圆资产管理系统</h1>
        {/* <Link to='/login' className='linkcss' >进入登陆界面</Link> */}
        <br/>
        <Link to='/home' className='linkcss'>进入主界面</Link>
    </div>
}