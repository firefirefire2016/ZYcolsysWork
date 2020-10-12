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
            title: '核算单位',            
            dataIndex: 'accountingunit',
            isShow: true,
            editable: true,
            isSelect:true,
            isInEdit:true,
            isMust:true,
        },        
        {
            title: '合同编号',
            isShow: true,
            dataIndex: 'contractno',
            editable: true,
            isInEdit:true,
            isSelect:true,
            isMust:true,
        },
        
        {
            title: '产权编号',
            dataIndex: 'rightno',
            isShow: false,
            editable: false,
            isInEdit:true,
            //isMust:true,
        },
        {
            title: '物业名称',
            isShow: true,
            dataIndex: 'simpleaddress',
            editable: false,
            isInEdit:true,
            isSelect:true,
            width:'15%',
        },
        {
            title: '建筑面积',
            isShow: true,
            editable: false,
            dataIndex: 'area',
            isInEdit:true,
        },
        {
            title: '套内面积',
           // isShow: true,
            editable: false,
            dataIndex: 'insidearea',
            isInEdit:true,
        },
        {
            title: '地址',
            dataIndex: 'address',
            editable: false,
            isInEdit:true,
        },
        {
            title: '客户名称',
            isShow: true,
            dataIndex: 'tenant',
            editable: true,
            isInEdit:true,
            isSelect:true,
            isMust:true,
        },
        {
            title: '联系电话',            
            dataIndex: 'tel_tenant',
            editable: true,
            isInEdit:true,
            isShow: false,
        },
        {
            title: '身份证号',            
            dataIndex: 'tenant_idno',
            editable: true,
            isInEdit:true,
            isShow: false,
        },
        // {
        //     title: '客户地址',            
        //     dataIndex: 'tenant_address',
        //     editable: true,
        //     isInEdit:true,
        //     isShow: false,
        // },
        {
            title: '计租日期',
            dataIndex: 'startdate',
            isShow: true,
            editable: true,
            isSelect:true,
            isInEdit:true,
            isMust:true,
        },
        {
            title: '结束日期',
            dataIndex: 'enddate',
            isShow: true,
            editable: true,
            isSelect:true,
            isInEdit:true,
            isMust:true,
        },
        {
            title: '每期收款日',            
            dataIndex: 'rentdate',
            //isShow: true,
            editable: true,
            isInEdit:true,
            isMust:true,
        },
        {
            title: '招租方式',
            dataIndex: 'renttype',
            isShow: false,
            isInEdit:true,
            editable: true,
        },
        {
            title: '租金',
            dataIndex: 'once_rent',
            isShow: true,
            // editable: true,
            // isInEdit:true,
        },
        // {
        //     title: '抄表类型',
        //     dataIndex: 'copytype',
        //     isShow: false,
        //     editable: true,
        //     isInEdit:true,
        // },
        {
            title: '押金',
            isShow: true,
            dataIndex: 'deposit',
            editable: true,
            isInEdit:true,
            isMust:true,
        },
        {
            title: '滞纳金比例',
            isShow: false,
            dataIndex: 'latefeesrate',
            editable: true,
            isInEdit:true,
        },        
        // {
        //     title: '付款周期(月数)',
        //     isShow: false,
        //     dataIndex: 'rentcycle',
        //     editable: true,
        //     isInEdit:true,
        //     isMust:true,
        // },
        // {
        //     title: '首期收款日',
        //     isShow: false,
        //     dataIndex: 'firstdate',
        //     editable: true,
        //     isInEdit:true,
        // },
        {
            title: '签订日期',
            isShow: true,
            dataIndex: 'signdate',
            editable: true,
            isMust:true,
            isInEdit:true,
        },
        {
            title: '签订人',
            isShow: true,
            dataIndex: 'agentman',
            editable: true,
            isSelect:true,
            isMust:true,
            isInEdit:true,
        },
        // {
        //     title: '租金模式',
        //     isShow: false,
        //     dataIndex: 'rentmode',
        //     editable: true,
        //     isInEdit:true,
        //     isMust:true,
        // },
        {
            title: '退租日期',
            isShow: false,
            dataIndex: 'quitdate',
            editable: true,
        },        
        {
            title: '状态',
            isShow: true,
            dataIndex: 'contract_status',
            editable: true,
            isSelect:true,
        },
        // {
        //     title: '免租开始日期',
        //     dataIndex: 'freestartdate',
        //    // isShow: true,
        //     editable: true,
        //    // isSelect:true,
        //     isInEdit:true,
        // },
        // {
        //     title: '免租结束日期',
        //     dataIndex: 'freeenddate',
        //    // isShow: true,
        //     editable: true,
        //     //isSelect:true,
        //     isInEdit:true,
        // },
        
        {
            title: '启用日期',
            isShow: false,
            dataIndex: 'effectdate',
            editable: false,
            isInEdit:true,
        },
        {
            title: '停用日期',
            isShow: false,
            dataIndex: 'stopdate',
            editable: false,
            isInEdit:true,
        },
        {
            title: '停用原因',
            isShow: false,
            dataIndex: 'stopreason',
            editable: false,
            isInEdit:true,
        },
        {
            title: '操作',
            isShow: true,
            dataIndex: 'operation',
            editable: false,
            isOper: true,
            //width: 250
        }
    ],

    //本期汇总表
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
            isShow: false,
            editable: false
        },
        {
            title: '物业名称',
            dataIndex: 'simpleaddress',
            isShow: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '收款日',
            dataIndex: 'rentdate',
            isShow: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '开始日期',
            dataIndex: 'startdate',
            isShow: true,
            editable: false,
        },
        {
            title: '结束日期',
            dataIndex: 'enddate',
            isShow: true,
            editable: false,
        },
        {
            title: '本期应收',
            dataIndex: 'amount_receivable',
            isShow: true,
            editable: false,
        },
        {
            title: '本期实收',
            dataIndex: 'amount_received',
            isShow: true,
            editable: true,
        },
        {
            title: '本期实收',
            dataIndex: 'nowrealrent',
            // isShow: true,
            // editable: true,
            isSelect:true,
        },
        {
            title: '本期应开票',
            dataIndex: 'invoice_limit',
            isShow: true,
            editable: false,
        },
        {
            title: '本期实开票',
            dataIndex: 'invoice_amount',
            isShow: true,
            editable: false,
        },    
        {
            title: '本期实开票',
            dataIndex: 'nowrealinvoice',
            isSelect:true,
        },       
        {
            title: '累计应收',
            dataIndex: 'totalneedAmount',
            isShow: true,
            editable: false,
        },
        {
            title: '累计实收',
            dataIndex: 'totalrealAmount',
            isShow: true,
            editable: false,
        },
        {
            title: '累计应开票',
            dataIndex: 'totalneedInvoice',
            isShow: true,
            editable: false,
        },
        {
            title: '累计实开票',
            dataIndex: 'totalrealInvoice',
            isShow: true,
            editable: false,
        },
        {
            title: '累计未收',
            dataIndex: 'isOwe',
            isShow: true,
            editable: false,
            isSelect:true,
        },
        {
            title: '累计未开',
            dataIndex: 'needInvoice',
            isShow: true,
            editable: false,
            isSelect:true,
        },
        {
            title: '逾期情况',
            dataIndex: 'overstate',
            isShow: true,
            editable: true,
            isSelect:true,
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
            isInEdit: true,
            editable: false,
            isMust:true,
            isSelect:true,
        },
        // {
        //     title: '合同编号',
        //     dataIndex: 'select_contractno',
        //     isShow: false,
        //     isInEdit: true,
        //     editable: false,
        //     isMust:true,
        // },
        {
            title: '账单编号',
            dataIndex: 'billno',
            isShow: true,
            isInEdit: true,
            editable: false,
            isSelect:true,
        },
        {
            title: '收款项目',
            dataIndex: 'create_itemname',
            isInEdit: true,
            editable: true,
            isMust:true,
        },
        {
            title: '收款项目',
            dataIndex: 'itemname',
            isInEdit: false,
            isShow: true,
            editable: true,
            isSelect:true,
            //isMust:true,
        },
        {
            title: '物业名称',
            dataIndex: 'simpleaddress',
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
            editable: false,
            isSelect:true,
            //isMust:true
        },
        {
            title: '收款日期',
            dataIndex: 'collectdate',
            isInEdit: true,
            isShow: false,
            editable: false
        },
        {
            title: '开票日期',
            dataIndex: 'invoicedate',
            isInEdit: true,
            isShow: false,
            editable: false
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
            width:'5%',
            render: (txt, record, index) => {
                return index + 1
            }
        },
        {
            title: '物业名称',
            dataIndex: 'simpleaddress',
            width:'15%',
            isShow: true,
            isInEdit: true,
            editable: true,
            isSelect:true,
            isMust:true,
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
            isMust:true,
        },
        
        {
            title: '物业性质',
            dataIndex: 'feature',
            isShow: true,
            isInEdit: true,
            editable: true,
            isSelect:true,
            isMust:true,
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
            isMust:true,
        },
        {
            title: '建筑面积(m²)',
            dataIndex: 'area',
            isInEdit: true,
            isShow: true,
            editable: true,
            isMust:true,
          //  width:'5%',
        },
        {
            title: '套内面积(m²)',
            dataIndex: 'insidearea',
            isInEdit: true,
            isShow: true,
            editable: true,
           // width:'5%',
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
            isMust:true,
        },
        {
            title: '附记',
            dataIndex: 'remarks',
            isInEdit: true,
            editable: true,
        },
        {
            title: '状态',
            dataIndex: 'property_status',
            isShow: true,
            //isInEdit: true,
            //editable: true,
            isSelect:true,
            selectMode:true,
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

     //租金标准表
     rentlistCol: [
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
            title: '开始日期',
            dataIndex: 'startdate',
            isInEdit: true,
            editable: true,
            isSelect:true,
            isMust:true,
        },  
        {
            title: '结束日期',
            dataIndex: 'enddate',
            isInEdit: true,
            editable: true,
            isSelect:true,
            isMust:true,
        },      
        // {
        //     title: '递增率',
        //     dataIndex: 'oncerate',
        //     isInEdit: true,
        //     editable: true,
        //     isSelect:true,
        // },
        // {
        //     title: '递增金额',
        //     dataIndex: 'onceamount',
        //     isInEdit: true,
        //     editable: true,
        //     isSelect:true,
        // },
        {
            title: '每期金额',
            dataIndex: 'endamount',
            isInEdit: true,
            editable: true,
            isSelect:true,
            isMust:true,
        },
        {
            title: '付款周期',
            dataIndex: 'rentcycle',
            isInEdit: true,
            editable: true,
            isSelect:true,
            isMust:true,
        },
        {
            title: '合同id',
            dataIndex: 'contractid',
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            isInEdit: true,
            editable: true,
            isSelect:true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            isInEdit: true,
          //  editable: true,
          //  isSelect:true,
            isOper:true,
        }

    ]

    

}


