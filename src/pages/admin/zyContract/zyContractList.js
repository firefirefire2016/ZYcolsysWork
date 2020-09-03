import React,{useEffect,useState} from 'react'
import { Card, Table, Button } from 'antd'
import { contractCol } from '../../../utils/listConfig'
import { getList } from '../../../services/zyService'



function zyContractList() {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dataSource,setDataSource] = useState([]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
          getList(1,200).then(res=>{
            console.log(res);
            //setData(res);
            setDataSource(res.rows);
         });
    }, [])

    const contractCol1= [
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

    return (
        <Card title="合同列表"
            extra={
                <Button type="primary" size="large">
                    新增合同
           </Button>

            }>


            <Table
                // components={{
                //     body: {
                //        // cell: EditableCell,
                //     },
                // }}
                rowKey="id"
                bordered
                columns={contractCol1}
                dataSource={dataSource}
                size="lager"
                // scroll={{ x: 'calc(700px + 50%)', y: 350 }}
                scroll={{ y: 350 }}
            />
        </Card>
    )
}

export default zyContractList

