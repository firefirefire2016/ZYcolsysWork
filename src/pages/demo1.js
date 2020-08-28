import React, { useState, useEffect } from 'react'
import { Link} from 'react-router-dom'; 
import { Table } from 'antd';
import axios from 'axios'
import './demo1.scss'

const Demo1 =()=>{

    const [data,setData] = useState([]);

    const [index,setIndex] = useState(0);

    useEffect(()=>{
        axios.get('/data.json').then((response)=>{
            const res = response.data;
            if(res.code === 0){
                setData(res.data);
            }
        })
    },[]);

    //合同表
    const columns= [
        {
            title:'合同编号',
            dataIndex:'contractno'
        },
        {
            title:'起始日期',
            dataIndex:'startdate'
        },
        {
            title:'终止日期',
            dataIndex:'enddate'
        },
        {
            title:'招租方式',
            dataIndex:'renttype'
        },
        {
            title:'产权证编号',
            dataIndex:'rightno'
        }
    ];

    //收款表
    const columns= [
        {
            title:'合同编号',
            dataIndex:'contractno'
        },
        {
            title:'收款月份',
            dataIndex:'month'
        },
        {
            title:'已收款金额',
            dataIndex:'amount_received'
        },
        {
            title:'应收金额',
            dataIndex:'amount_receivable'
        },
        {
            title:'开票金额',
            dataIndex:'invoice_amount'
        }
        
    ];

    //单位表
    const columns= [
        {
            title:'单位名称',
            dataIndex:'unit_name'
        },
        {
            title:'单位性质',
            dataIndex:'unit_type'
        },
        {
            title:'单位联系人',
            dataIndex:'unit_contacts'
        },
        {
            title:'联系电话',
            dataIndex:'unit_tel'
        },
        {
            title:'单位住址',
            dataIndex:'unit_add'
        }
    ];


    return     <div className='home'>
        <h1>合同表</h1>
        <div className='wrap'>
            <div className='nav'>
                <a className={index == 0?'checked':''} onClick={()=>{
                    setIndex(0);
                }} >合同表</a>
                <a className={index == 1?'checked':''} onClick={()=>{
                    setIndex(1);
                }} >收款表</a>
                <a className={index == 2?'checked':''} onClick={()=>{
                    setIndex(2);
                }} >单位表</a>
                <a className={index == 3?'checked':''} onClick={()=>{
                    setIndex(3);
                }} >其他</a>
            </div>
            <p>数据演示</p>
            <Table 
                bordered
                columns={columns}
                dataSource={data}/>
            <Link to="/" className='linkcs'>回到首页</Link>
        </div>
    </div>
}


export default Demo1;