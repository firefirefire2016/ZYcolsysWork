import React,{useEffect,useState} from 'react'

export const sysCols = {
     contractCol : [
        {
            title:'序号',
            key:'id',
            align:"center",
            editable:false,
            render: (txt,record,index) => {
               return index +1
            }
        },
        {
            title:'合同编号',
            dataIndex:'contractno',
            editable:true
        },
        {
            title:'起始日期',
            dataIndex:'startdate',
            editable:true,
        },
        {
            title:'终止日期',
            dataIndex:'enddate',
            editable:true,
        },
        {
          title:'收款日',
          dataIndex:'rentdate',
          editable:true,
        },
        {
            title:'招租方式',
            dataIndex:'renttype',
            editable:true,
        },
        {
          title:'每月租金',
          dataIndex:'month_rent',
          editable:true,
        },
        {
            title:'产权证编号',
            dataIndex:'rightno',
            editable:true,
        },
        {
          title: '操作',
          dataIndex: 'operation',
          editable:false,
          isOper:true,
          width:250
        }
    ]

}


