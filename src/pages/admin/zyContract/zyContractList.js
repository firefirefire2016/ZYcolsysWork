import React,{useEffect,useState} from 'react'
import { Card, Table, Button, Select, Popconfirm } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { getList } from '../../../services/zyService'
import Form from 'antd/lib/form/Form';
import '../../home.scss'

const cols = sysCols.contractCol;

function zyContractList() {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dataSource,setDataSource] = useState([]);

    const EditableCell = ({
        children,
        record,
        isWarn,
        ...restProps
      }) => {
        
         return (
          <td {...restProps} type='primary' className=''>
            
            {children}
          </td>
        );
      };

    const mergedColumns = cols => cols.map(col => {
        if (!col.editable) {  
          if(col.isOper === true){
            col.render = (text, record,index) => {
              return  (
                <span className=''>
                <Button type="primary" 
                style={{
                  marginRight: 8,
                }}>
                  编辑
                </Button>
                <Popconfirm 
                    title='确定删除么?'
                   >
                <Button type="primary" 
                style={{
                  marginRight: 8,
                }}>
                      删 除
                </Button>
                </Popconfirm>
  
                <Popconfirm 
                    title='确定终止该合同么?'
                    disabled={ record.status === 2}
                   >
                <Button type="primary"  disabled={record.status === 2}
                style={{
                  marginRight: 8,
                }}>
                      终止
                </Button>
                </Popconfirm>
                
                </span>
              );
            }
          }

          
          return col;
        }

        // col.render = (text, record,index) =>{
        //     return (
        //         <span className='warn'>{text}</span>
        //     )
        // }
    
        return {
          ...col
        };
      });


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
          getList(1,200).then(res=>{
            console.log(res);
            //setData(res);
            setDataSource(res.rows);
         });
    }, [])

    

    return (
        <Card title="合同列表"
            extra={
                <Button type="primary" size="large">
                    新增合同
           </Button>

            }>


            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                rowKey="id"
                bordered
                columns={mergedColumns(cols)}
                dataSource={dataSource}
                size="lager"
                // scroll={{ x: 'calc(700px + 50%)', y: 350 }}
                scroll={{ y: 350 }}
            />
        </Card>
    )
}

export default zyContractList

