import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../demos/home.scss'
import { onLoadCollectionData,RentToMergeData,onLoadTargetRent} from '../../../store/actions/zyCollectionData';
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel,consoleTarget } from '../../../utils/ItemUtils';
import { rentMergeQuery } from '../../../utils/common';

const cols = sysCols.MergeRentCol.filter(item => item.isShow);

const ysorno = selectItems.yesOrNo;

//const renttypes = selectItems.renttypes;

const { Option } = Select;


const ZyRentList = (props) => {

  //console.log(props);
  const [form] = Form.useForm();

  const [isInit,setIsInit] = useState(true);

  const EditableCell = ({
    labelType,
    children,
    record,
    isWarn,
    ...restProps
  }) => {

    return (
      <td {...restProps} type='primary' className='' className={(isWarn )?'warn':''}>

        {parseTypeToLabel(record, labelType, children)}
      </td>
    );
  };





  const mergedColumns = cols => cols.map(col => {
    //console.log(list);
    if (!col.editable) {
      if (col.isOper === true) {
        col.render = (text, record, index) => {
          return (
            <span className=''>
              <Button type="primary"
                style={{
                  marginRight: 8,
                }}
                onClick={() => edit(record)}
              >
                查看账单
                </Button>
              
            </span>
          );
        }
      }


      
    }

    return {
      ...col,
      onCell: (record, rowIndex) => (

        {
          //record,
          labelType: parseItemtype(col.dataIndex),
          rowIndex,
          isWarn: record.isWarn ===1 ? true : false,
          //isWarn:consoleTarget(record),
          dataIndex: col.dataIndex,
          title: col.title,
          record
        }
      )
    };
  });


  const { list, page, total, limit,onLoadData,onLoadTartgetData,SelectByREQ } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    message.info('加载中...');  

    

    setTimeout(() => {
    }, 1000);

    if(isInit){

      console.log(' Init = ' + isInit);
      onLoadData(1, -1,isInit);
      setIsInit(false);
    }
    else{
      onLoadData(1, limit);
    }
    

    //console.log(list);

    

  }, [])

  


  const edit = record => {
    //console.log(list);
    //console.log('record=' + JSON.stringify(record) );

    //let contractid = record.contractid
    //设置要编辑的id
    onLoadTartgetData(page,limit,record);

    props.history.push('/admin/zyRentDetailList');



  };

  

  const ResetValue = () => {
    form.resetFields();
  }

  /**
   * 筛选
   */
  const onSelectByParams = ()=>{
    let reqs = form.getFieldsValue();

    let tenant = reqs['tenant'];

    let month_rent = reqs['month_rent'];

    let isOwe = reqs['isOwe'];

    let needInvoice = reqs['needInvoice'];

    //console.log( reqs);

    SelectByREQ(tenant,month_rent,isOwe,needInvoice,page,limit);
  }

  return (
    <Card title="租赁概况列表">


      <Form
        form={form}
        layout="inline"
        className="components-table-demo-control-bar"
        style={{ marginBottom: 16 }}
      >
        <Form.Item
          name="tenant"
          label='承租方'
        >
          <Input placeholder="承租方" type="text"

          />
        </Form.Item>


        <Form.Item
          label='月租>='
          name="month_rent"
        >
          <Input placeholder="月租" type="text"/>
            {/* {renttypes.map((type, index) => (
              <Option key={index} value={index}>{type}</Option>
            ))} */}
        </Form.Item>

        <Form.Item
          label='是否欠租'
          name="isOwe"
          marginRight='20px'
        >
          <Select style={{width:'100px'}}
          >
            {ysorno.map((type, index) => (
              <Option key={index} value={index}>{type}</Option>
            ))}
            </Select>

        </Form.Item>

        <Form.Item
          name="needInvoice"
          label='有发票未完成'
        >
          <Select style={{width:'100px'}}
          >
            {ysorno.map((type, index) => (
              <Option key={index} value={index}>{type}</Option>
            ))}
            </Select>
        </Form.Item>

        <Form.Item >
          <Button type="primary" onClick={onSelectByParams} >筛选</Button>
          <Button type="primary" htmlType="reset"
                        //className="login-form-button"
                        className="btn" onClick={ResetValue}
                    >
                        重置条件
                    </Button>
        </Form.Item>

      </Form>
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
        pagination={{
          
          total,
          showSizeChanger: true,
          onChange: (p) => {
            onLoadData(p, limit);
          },
          onShowSizeChange: (current, size) => {
            onLoadData(1, size);
          }
        }
        }
        // scroll={{ x: 'calc(700px + 50%)', y: 350 }}
        scroll={{ y: 350 }}
      />
    </Card>
  )
}

const mapStateToProps = (state) => {
  return state.zyCollectionData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
  return {
    onLoadData: (page, limit,isInit) => { RentToMergeData(dispatch, {page, limit,isInit}) },
    onLoadTartgetData: (page, limit,record) => { onLoadTargetRent(dispatch, {page, limit,record}) },
    SelectByREQ:(tenant,month_rent,isOwe,needInvoice,page,limit) => { RentToMergeData(dispatch,{tenant,month_rent,isOwe,needInvoice,page,limit}) },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ZyRentList)

