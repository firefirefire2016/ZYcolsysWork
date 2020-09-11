import React,{useEffect,useState} from 'react'

export const sysCols = {
     contractCol : [
        {
            title:'序号',
            key:'id',
            align:"center",
            editable:false,
            isShow:true,
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
            isShow:false,
            dataIndex:'rightno',
            editable:true,
        },
        {
            title:'承租方',
            isShow:false,
            dataIndex:'tenant',
            editable:true,
        },
        {
            title:'押金',
            isShow:false,
            dataIndex:'deposit',
            editable:true,
        },
        {
          title: '操作',
          isShow:true,
          dataIndex: 'operation',
          editable:false,
          isOper:true,
          width:250
        }
    ],

    //收租汇总表
    MergeRentCol :[
        {
            title:'序号',
            key:'id',
            align:"center",
            editable:false,
            isShow:true,
            render: (txt,record,index) => {
               return index +1
            }
        },
        {
            title:'合同ID',
            dataIndex:'contractid',
            isShow:false,
            editable:false
        },
        {
            title:'合同编号',
            dataIndex:'contractno',
            isShow:true,
            editable:false
        },
        {
            title:'承租方',
            dataIndex:'tenant',
            isShow:true,
            editable:false
        },
        {
            title:'收租日',
            dataIndex:'rentdate',
            isShow:true,
            editable:false
        },
        {
          title:'累计收款总额',
          dataIndex:'totalAmount',
          isShow:true,
          editable:false
        },
        {
            title:'当前月份收款额',
            dataIndex:'current_received',
            isShow:true,
            editable:false
        },
        {
            title:'当前月份开票金额',
            dataIndex:'current_invoice',
            isShow:true,
            editable:false
        },
        {
            title:'月租金额',
            dataIndex:'month_rent',
            isShow:true,
            editable:false
        },
        {
          title: '操作',
          dataIndex: 'operation',
          isShow:true,
          editable:false,
          isOper:true
        }
        
    ],

    //收租表
    rentCol :[
        {
            title:'序号',
            key:'id',
            align:"center",
            editable:false,
            isShow:true,
            render: (txt,record,index) => {
               return index +1
            }
        },
        {
            title:'合同编号',
            dataIndex:'contractno',
            isShow:true,
            editable:true
        },
        {
          title:'收款年份',
          dataIndex:'year',
          isShow:true,
          editable:true
        },
        {
            title:'收款月份',
            dataIndex:'month',
            isShow:true,
            editable:true
        },
        {
            title:'已收款金额',
            dataIndex:'amount_received',
            isShow:true,
            editable:false
        },
        {
            title:'应收金额',
            dataIndex:'amount_receivable',
            isShow:true,
            editable:true
        },
        {
            title:'开票金额',
            dataIndex:'invoice_amount',
            isShow:true,
            editable:true
        },
        {
          title: '操作',
          dataIndex: 'operation',
          isShow:true,
          editable:false,
          isOper:true
        }
        
    ]

}


