import React,{useEffect,useState} from 'react'

export const sysCols = {
     contractCol : [
        {
            title:'序号',
            key:'id',
            align:"center",
            editable:false,
            isShow:false,
            render: (txt,record,index) => {
               return index +1
            }
        },
        {
            title:'合同编号',
            isShow:true,
            dataIndex:'contractno',
            editable:true
        },
        {
            title:'起始日期',
            isShow:true,
            dataIndex:'startdate',
            editable:true,
        },
        {
            title:'终止日期',
            isShow:true,
            dataIndex:'enddate',
            editable:true,
        },
        {
          title:'收款日',
          isShow:true,
          dataIndex:'rentdate',
          editable:true,
        },
        {
            title:'招租方式',
            isShow:true,
            dataIndex:'renttype',
            editable:true,
        },
        {
          title:'每月租金',
          isShow:true,
          dataIndex:'month_rent',
          editable:true,
        },
        {
            title:'产权证编号',
            isShow:true,
            dataIndex:'rightno',
            editable:true,
        },
        {
          title: '操作',
          isShow:false,
          dataIndex: 'operation',
          editable:false,
          isOper:true,
          width:250
        }
    ]

}


