import React, { useEffect, useState } from 'react'

export const sysCols = {
    
    // rentcycle: DataTypes.STRING,//付款周期
    // firstdate:DataTypes.STRING,//首期收款日
    // signdate:DataTypes.STRING,//签订日期
    // agentman:DataTypes.STRING,//对接人 
    // rentmode:DataTypes.STRING,//租金模式 
    // needcopy:DataTypes.STRING,//是否需要抄表
    // quitdate:DataTypes.STRING,//退租日期
    // property_name:DataTypes.STRING,//物业名称
    contractCol: [
        {
            title: '序号',
            key: 'id',
            align: "center",
            editable: false,
            isShow: true,
            render: (txt, record, index) => {
                return index + 1
            }
        },
        {
            title: '合同编号',
            isShow: true,
            dataIndex: 'contractno',
            editable: true
        },
        {
            title: '起始日期',
            isShow: true,
            dataIndex: 'startdate',
            editable: true,
        },
        {
            title: '到期日期',
            isShow: true,
            dataIndex: 'enddate',
            editable: true,
        },
        {
            title: '收款日',
            isShow: true,
            dataIndex: 'rentdate',
            editable: true,
        },
        {
            title: '招租方式',
            isShow: false,
            dataIndex: 'renttype',
            editable: true,
        },
        {
            title: '地址',
            isShow: true,
            dataIndex: 'address',
            editable: true,
        },
        {
            title: '每月租金',
            isShow: true,
            dataIndex: 'month_rent',
            editable: true,
        },
        {
            title: '产权证编号',
            isShow: false,
            dataIndex: 'rightno',
            editable: true,
        },
        {
            title: '客户名称',
            isShow: false,
            dataIndex: 'tenant',
            editable: true,
        },
        {
            title: '押金',
            isShow: false,
            dataIndex: 'deposit',
            editable: true,
        },
        {
            title: '付款周期',
            isShow: false,
            dataIndex: 'rentcycle',
            editable: true,
        },
        {
            title: '首期收款日',
            isShow: false,
            dataIndex: 'firstdate',
            editable: true,
        },
        {
            title: '签订日期',
            isShow: true,
            dataIndex: 'signdate',
            editable: true,
        },
        {
            title: '对接人',
            isShow: true,
            dataIndex: 'agentman',
            editable: true,
        },
        {
            title: '租金模式',
            isShow: false,
            dataIndex: 'rentmode',
            editable: true,
        },
        {
            title: '是否需要抄表',
            isShow: false,
            dataIndex: 'needcopy',
            editable: true,
        },
        {
            title: '退租日期',
            isShow: true,
            dataIndex: 'quitdate',
            editable: true,
        },
        {
            title: '物业名称',
            isShow: false,
            dataIndex: 'property_name',
            editable: true,
        },
        {
            title: '合同状态',
            isShow: false,
            dataIndex: 'contract_status',
            editable: true,
        },
        {
            title: '操作',
            isShow: true,
            dataIndex: 'operation',
            editable: false,
            isOper: true,
            width: 250
        }
    ],

    //收租汇总表
    MergeRentCol: [
        {
            title: '序号',
            key: 'id',
            align: "center",
            editable: false,
            isShow: true,
            render: (txt, record, index) => {
                return index + 1
            }
        },
        {
            title: '合同ID',
            dataIndex: 'contractid',
            isShow: false,
            editable: false
        },
        {
            title: '合同编号',
            dataIndex: 'contractno',
            isShow: true,
            editable: false
        },
        {
            title: '承租方',
            dataIndex: 'tenant',
            isShow: true,
            editable: false
        },
        {
            title: '收租日',
            dataIndex: 'rentdate',
            isShow: true,
            editable: false
        },
        {
            title: '累计收款总额',
            dataIndex: 'totalAmount',
            isShow: true,
            editable: false,
            //render: text => <a>{text}</a>
        },
        {
            title: '是否有欠租',
            dataIndex: 'isOwe',
            isShow: true,
            editable: false
        },
        {
            title: '有发票未完成',
            dataIndex: 'needInvoice',
            isShow: true,
            editable: false
        },
        {
            title: '月租金额',
            dataIndex: 'month_rent',
            isShow: true,
            editable: false
        },
        {
            title: '操作',
            dataIndex: 'operation',
            isShow: true,
            editable: false,
            isOper: true
        }

    ],

    //收租详情表
    rentCol: [
        {
            title: '序号',
            key: 'id',
            align: "center",
            editable: false,
            isInEdit: false,
            isShow: true,
            render: (txt, record, index) => {
                return index + 1
            }
        },
        {
            title: '合同编号',
            dataIndex: 'contractno',
            isShow: false,
            isSelect:true
        },
        {
            title: '合同编号',
            dataIndex: 'select_contractno',
            isShow: false,
            isInEdit: true,
            editable: true,
        },
        {
            title: '账单编号',
            dataIndex: 'billno',
            isShow: true,
            isInEdit: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '收款项目',
            dataIndex: 'create_itemname',
            isInEdit: true,
            editable: true,
        },
        {
            title: '收款项目',
            dataIndex: 'itemname',
            isInEdit: false,
            isShow: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '物业名称',
            dataIndex: 'property_name',
            isInEdit: false,
            isShow: true,
            editable: false,
            isSelect:true,
        },
        {
            title: '收款日',
            dataIndex: 'rentdate',
            isInEdit: true,
            isShow: true,
            editable: false,
            isSelect:true,
        },
        {
            title: '账单开始日期',
            dataIndex: 'startdate',
            isInEdit: true,
            isShow: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '账单结束日期',
            dataIndex: 'enddate',
            isInEdit: true,
            isShow: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '应收金额',
            dataIndex: 'amount_receivable',
            isInEdit: true,
            isShow: true,
            editable: true
        },
        {
            title: '实收金额',
            dataIndex: 'amount_received',
            isInEdit: true,
            isShow: true,
            editable: true,
            isSelect:false,
        },
        {
            title: '实收金额',
            dataIndex: 'amount_select',
            //isInEdit: true,
            isSelect:true,
        },  
        {
            title: '实开票',
            dataIndex: 'invoice_select',
            //isInEdit: true,
            isSelect:true,
        },      
        {
            title: '应开票',
            dataIndex: 'invoice_limit',
            isInEdit: true,
            isShow: true,
            editable: true
        },
        {
            title: '实开票',
            dataIndex: 'invoice_amount',
            isInEdit: true,
            isShow: true,
            editable: true,
            isSelect:false,
        },
        {
            title: '逾期情况',
            dataIndex: 'overstate',
            isInEdit: true,
            isShow: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '收款日期',
            dataIndex: 'collectdate',
            isInEdit: true,
            isShow: false,
            editable: true
        },
        {
            title: '开票日期',
            dataIndex: 'invoicedate',
            isInEdit: true,
            isShow: false,
            editable: true
        },
        {
            title: '操作',
            dataIndex: 'operation',
            isInEdit: false,
            isShow: true,
            editable: false,
            isOper: true
        }

    ],

    //产权表
    propertyCol: [
        {
            title: '序号',
            key: 'id',
            align: "center",
            editable: false,
            isInEdit: false,
            isShow: true,
            render: (txt, record, index) => {
                return index + 1
            }
        },
        {
            title: '物业名称',
            dataIndex: 'simpleaddress',
            isShow: true,
            isInEdit: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '产权证号',
            dataIndex: 'rightno',
            isShow: true,
            isInEdit: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '权属人',
            dataIndex: 'owner',
            isShow: true,
            isInEdit: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '状态',
            dataIndex: 'property_status',
            isShow: true,
            //isInEdit: true,
            //editable: true,
            isSelect:true,
        },
        {
            title: '物业性质',
            dataIndex: 'feature',
            isShow: true,
            isInEdit: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '社区',
            dataIndex: 'community',
            isShow: true,
            isInEdit: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '类别',
            dataIndex: 'righttype',
            isShow: true,
            isInEdit: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '建筑面积(平方)',
            dataIndex: 'area',
            isInEdit: true,
            isShow: true,
            editable: true,
        },
        {
            title: '套内面积(平方)',
            dataIndex: 'insidearea',
            isInEdit: true,
            isShow: true,
            editable: true,
        },
        {
            title: '共有情况',
            dataIndex: 'commonstate',
            isInEdit: true,
            editable: true,
        },
        {
            title: '不动产单元号',
            dataIndex: 'unitno',
            isInEdit: true,
            editable: true,
        },
        {
            title: '用途',
            dataIndex: 'usereason',
            isInEdit: true,
            editable: true,
        },  
        {
            title: '权利性质',
            dataIndex: 'rightfeature',
            isInEdit: true,
            editable: true,
        },      
        {
            title: '使用期限',
            dataIndex: 'limitdate',
            isInEdit: true,
            editable: true,
        },
        {
            title: '权利其他状态',
            dataIndex: 'otherstatus',
            isInEdit: true,
            editable: true,
        },
        {
            title: '地址',
            dataIndex: 'address',
            isInEdit: true,
            editable: true,
        },
        {
            title: '附记',
            dataIndex: 'remarks',
            isInEdit: true,
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            isInEdit: false,
            isShow: true,
            editable: false,
            isOper: true
        }

    ]

}


