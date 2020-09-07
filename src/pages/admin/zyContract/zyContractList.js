import React,{useEffect,useState} from 'react'
import { Card, Table, Button, Select, Popconfirm } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { getList } from '../../../services/zyService'
import Form from 'antd/lib/form/Form';
import '../../home.scss'
import { loadContractData } from '../../../store/actions/zyContractData';
import { connect } from 'react-redux';

const cols = sysCols.contractCol;

function zyContractList(props) {
    console.log(props);
    // eslint-disable-next-line react-hooks/rules-of-hooks

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

    const {list,page,total,limit} = props;

    const loadData = () =>{
      props.dispatch(
        loadContractData({
          page,
          limit:2
        })
      );
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {

          props.dispatch(
            loadContractData({
              page:1,
              limit:2
            })
          );
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
                dataSource={list}
                size="lager"
                pagination={{total,defaultPageSize:2,
                  onChange:(p)=>{
                    //console.log('更换页码为' + this.pageSize);
                    props.dispatch(loadContractData({page:p,limit}));
                  },
                  onShowSizeChange:(current,size)=>{

                  }
                  }
                }
                // scroll={{ x: 'calc(700px + 50%)', y: 350 }}
                scroll={{ y: 350 }}
            />
        </Card>
    )
}

export default connect(state=>state.zyContractData)(zyContractList)

