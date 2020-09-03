import React,{useEffect,useState} from 'react'


//合同表
export const contractCol= [
    {
        title:'序号',
        key:'id',
        align:"center",
        editable:false,
        render: (txt,record,index) => index +1
    },
    {
        title:'合同编号',
        dataIndex:'contractno',
        editable:true
        //width:'10%'
    },
    {
        title:'起始日期',
        dataIndex:'startdate',
        editable:true,
        //width:'12%'
    },
    {
        title:'终止日期',
        dataIndex:'enddate',
        editable:true,
        //width:'12%'
    },
    {
      title:'收款日',
      dataIndex:'rentdate',
      editable:true,
      //width:'10%'
    },
    {
        title:'招租方式',
        dataIndex:'renttype',
        editable:true,
        //width:'10%'
    },
    {
      title:'每月租金',
      dataIndex:'month_rent',
      editable:true,
      //width:'10%'
    },
    {
        title:'产权证编号',
        dataIndex:'rightno',
        editable:true,
        //width:'10%'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      editable:false,
      isOper:true,
      width:250
    }
];