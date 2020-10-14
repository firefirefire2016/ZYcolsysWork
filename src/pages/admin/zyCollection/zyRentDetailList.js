import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message, Spin, Modal } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../demos/home.scss'
import { onEditDetail, onLoadTargetListByREQ, onCreateData, onShowDetail, onCommitEdit } from '../../../store/actions/zyCollectionAct';
import { connect } from 'react-redux';
import { parseItemtype, parseTypeToLabel, consoleTarget, parseInputNode } from '../../../utils/ItemUtils';
import { getTodayDateStr, getTodayStr } from '../../../utils/common';


const selectItems = sysCols.rentCol.filter(item => item.isSelect);

const cols = sysCols.rentCol.filter(item => item.isShow);

//const renttypes = selectItems.renttypes;

const { Option } = Select;




const ZyRentDetailList = (props) => {

  //console.log(props);
  const [form] = Form.useForm();

  const [modelFrom] = Form.useForm();

  const [invoiceFrom] = Form.useForm();

  const [isInit, setIsInit] = useState(true);

  const [date, setDate] = useState('');

  //const [isLoading,setIsLoading] = useState(true);

  const EditableCell = ({
    children,
    dataIndex,
    record,
    isWarn,
  }) => {


    return (

      <td type='primary' className={(isWarn) ? 'warn' : ''}>

        {parseTypeToLabel(record, dataIndex, children)}
      </td>
    );
  };

  const mergedColumns = cols => cols.map(col => {
    if (!col.editable) {
      if (col.isOper === true) {
        col.render = (text, record, index) => {
          switch (record.itemname) {
            case '1'://合同租金
              return (
                <span className=''>
                  <Button type="primary"
                    style={{
                      marginRight: 8,
                    }}
                    onClick={() => getRent(record)}
                  >
                    收款
                  </Button>
                  <Button type="primary"
                    style={{
                      marginRight: 8,
                    }}
                    onClick={() => getInvoice(record)}
                  >
                    开票
                  </Button>
                  <Button type="primary"
                    style={{
                      marginRight: 8,
                    }}
                    onClick={() => loadDetail(record)}
                  >
                    详情
                  </Button>
                </span>
              )
            case '2'://押金
              return (
                <span className=''>
                  <Button type="primary"
                    style={{
                      marginRight: 8,
                    }}
                    onClick={() => edit(record)}
                  >
                    编辑
                  </Button>
                  <Popconfirm title='确定删除该账单么?' onConfirm={() => {
                    del(record)
                  }}
                  >
                    <Button type="primary" style={{ marginRight: 8 }}>
                      删 除
                  </Button>
                  </Popconfirm>
                  <Button type="primary"
                    style={{
                      marginRight: 8,
                    }}
                    onClick={() => loadDetail(record)}
                  >
                    详情
                  </Button>
                </span>
              )
            case '3'://管理费
              return (
                <span className=''>
                  <Button type="primary"
                    style={{
                      marginRight: 8,
                    }}
                    onClick={() => edit(record)}
                  >
                    编辑
                  </Button>
                  <Popconfirm title='确定删除该账单么?' onConfirm={() => {
                    del(record)
                  }}
                  >
                    <Button type="primary" style={{ marginRight: 8 }}>
                      删 除
                  </Button>
                  </Popconfirm>
                  <Button type="primary"
                    style={{
                      marginRight: 8,
                    }}
                    onClick={() => loadDetail(record)}
                  >
                    详情
                  </Button>
                </span>

              )
            case '4'://其他
              return (
                <span className=''>
                  <Button type="primary"
                    style={{
                      marginRight: 8,
                    }}
                    onClick={() => edit(record)}
                  >
                    编辑
                  </Button>
                  <Popconfirm title='确定删除该账单么?' onConfirm={() => {
                    del(record)
                  }}
                  >
                    <Button type="primary" style={{ marginRight: 8 }}>
                      删 除
                  </Button>
                  </Popconfirm>
                  <Button type="primary"
                    style={{
                      marginRight: 8,
                    }}
                    onClick={() => loadDetail(record)}
                  >
                    详情
                  </Button>
                </span>
              )
            default:
              return (
                <span className=''>
                  <Button type="primary"
                    style={{
                      marginRight: 8,
                    }}
                    onClick={() => edit(record)}
                  >
                    编辑
                  </Button>
                  <Popconfirm title='确定删除该账单么?' onConfirm={() => {
                    del(record)
                  }}
                  >
                    <Button type="primary" style={{ marginRight: 8 }}>
                      删 除
                  </Button>
                  </Popconfirm>
                  <Button type="primary"
                    style={{
                      marginRight: 8,
                    }}
                    onClick={() => loadDetail(record)}
                  >
                    详情
                  </Button>
                </span>
              )
          }
        }
      }



    }

    return {
      ...col,
      align:'center',
      onCell: (record, rowIndex) => (

        {
          //record,
          labelType: col.dataIndex,
          rowIndex,
          isWarn: record.isWarn ? true : false,
          dataIndex: col.dataIndex,
          title: col.title,
          record
        }
      )
    };
  });

  const { page, total, limit, list, contractid, contractno, overstate,
    onEditOne, SelectByREQ, onCreate, isLoading, onShowOne, onEditClick,
    mode,isOwe,needInvoice} = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    //message.info('加载中...');
    //console.log('props = ' + props);

    switch (mode) {
      case 'creating':
        props.history.push('/admin/zyRentDetail/edit');
        return;
      case 'home':
        break;
      case 'deled':
        break;
      default:
        break;
    }
    


    setDate(getTodayDateStr);

    if (isInit) {
      //onLoadData(1, -1, contractid,isInit);
      
      setIsInit(false);
      let amount_select;
      let invoice_select;
      //console.log('props = ' + props);
      if(isOwe !== undefined && needInvoice !== undefined){
        if(isOwe>0){
          amount_select = '2';
        }
        else{
          amount_select= '0';
        }
        if(needInvoice>0){
          invoice_select = '2'
        }
        else{
          invoice_select = '0'
        }
        form.setFieldsValue({
          contractno:contractno,
          amount_select,
          invoice_select,
        })
      }
      
     // console.log('来到这里');
     //console.log('contractno = ' + contractno);

     let reqs = form.getFieldsValue();  
      
     // SelectByREQ(1, -1, { contractid, isInit,contractno,amount_select,invoice_select});
      SelectByREQ(1, -1, reqs);
     //SelectByREQ(1, -1, {  isInit});
    }
    else {

      let reqs = form.getFieldsValue(); 

      SelectByREQ(page, limit,reqs);

    }


    //console.log('props = ' + JSON.stringify(props) );

    // setTimeout(() => {
      
    // }, 100);

  }, [mode])



  //收款
  const getRent = record => {

    Modal.confirm({
      title: '收款',
      visible: true,

      content: (
        <Form form={modelFrom} layout="vertical" name="userForm"
          initialValues={{
            //['amount']: '3',
            'collectdate': date
          }}
          onFinish={values => {
            //console.log('检查一下' + JSON.stringify(values) + JSON.stringify(record) );

          }}
        >
          <Form.Item
            name="amount"
            label="收款金额"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber style={{ width: '200px' }} type={'number'} />
          </Form.Item>
          <Form.Item
            name="collectdate"
            label="收款日期"

            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type={'date'} style={{ width: '200px' }} />
          </Form.Item>
        </Form>
      ),
      onOk() {
        // console.log(JSON.stringify(modelFrom.getFieldsValue()));
        // setRentable(false);
        let values = modelFrom.getFieldsValue();
        if(values.amount === undefined){
          values.amount = 0;
        }
        record.amount_received =  values.amount;
        record.collectdate = values.collectdate;


        // if((record.overstate === 1 || record.overstate === 2) &&
        //   record.amount_received >= record.amount_receivable){
        //     record.overstate = 3;
        // }
        // let today = getTodayStr();
        // if((record.overstate === 3) &&
        //   record.amount_received >= record.amount_receivable){
        //     record.overstate = 3;
        // }
        // if((record.overstate === 1 || record.overstate === 2) &&
        //   record.amount_received >= record.amount_receivable){
        //     record.overstate = 3;
        // }


        onEditClick(record, 'COMMIT_GetRent')
      },
      onCancel() { },

      okText: '提交',
      cancelText: '取消'
    });

  }

  //开票
  const getInvoice = record => {
    Modal.confirm({
      title: '开票',
      content: (
        <Form form={invoiceFrom} layout="vertical" name="userForm"
          initialValues={{
            //['amount']: '3',
            ['invoicedate']: date
          }}
          onFinish={values => {
            //console.log('检查一下' + JSON.stringify(values) + JSON.stringify(record) );

          }}
        >
          <Form.Item
            name="amount"
            label="开票金额"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber style={{ width: '200px' }} type={'number'} />
          </Form.Item>
          <Form.Item
            name="invoicedate"
            label="开票日期"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type={'date'} />
          </Form.Item>
        </Form>
      ),
      onOk() {
        let values = invoiceFrom.getFieldValue();
        if(values.amount === undefined){
          values.amount = 0;
        }
        record.invoice_amount =  values.amount;
        record.invoicedate = values.invoicedate;
        //console.log(JSON.stringify(list));
        onEditClick(record, 'COMMIT_GetInvoice')
      },
      onCancel() { },

      okText: '提交',
      cancelText: '取消'
    });
  }

  //详情
  const loadDetail = record => {
    onShowOne(record);
    props.history.push('/admin/zyRentDetail/edit');
  }

  //编辑
  const edit = record => {

    //设置要编辑的id
    onEditOne(record);
    props.history.push('/admin/zyRentDetail/edit');

  };

  //删除
  const del = record => {
    // let _record = {};
    // _record.id = record.id;
    record.status = -1;
    onEditClick(record, 'COMMIT_DELRENT')
  }

  const ResetValue = () => {
    form.resetFields();
  }

  /**
   * 筛选
   */
  const onSelectByParams = () => {

    let reqs = form.getFieldsValue();    

    SelectByREQ(1, limit, reqs);
  }

  /**
   * 切换页码或更改显示行数的时候出发
   * @param {*} page 
   * @param {*} limit 
   */
  const onChangeSize = (page, limit) => {
    let reqs = form.getFieldsValue();

    SelectByREQ(page, limit, reqs);
  }


  return (
    <Card title="账单明细"
      extra={
        <Form.Item >
          {/* <Button type="primary" size="large" onClick={() => {
            props.history.push('/admin/zyRentList');
          }}>
            本期账单
         </Button> */}
          <Button type="primary" size="large" onClick={() => {
            //设置要编辑的id
            onCreate(true);
            
          }}>
            新增
         </Button>
        </Form.Item>
      }
    >

      <Spin spinning={isLoading? true : false} >
        <Form
          form={form}
          layout="inline"
          className="components-table-demo-control-bar"
          style={{ marginBottom: 16 }
          }

        >
          {selectItems.map(item => {
            return (
              <Form.Item
                name={item.dataIndex}
                label={item.title}
                key={item.dataIndex}
              >
                {parseInputNode(item, 'screening')}
              </Form.Item>
            )
          })}

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
            onChange: (p, size) => {
              onChangeSize(p, size);
            },
            onShowSizeChange: (current, size) => {
              onChangeSize(1, size);
            }
          }
          }
          // scroll={{ x: 'calc(700px + 50%)', y: 350 }}
          scroll={{ y: 350 }}
        />
      </Spin>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return state.zyCollectionData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
  return {
    onCreate: (isCreating) => { onCreateData(dispatch, isCreating) },

    onShowOne: (record) => { onShowDetail(dispatch, { record }) },
    //onLoadData: (page, limit, contractid,isInit) => { onLoadTargetRentList(dispatch, { page, limit, contractid,isInit }) },
    onEditOne: (record) => { onEditDetail(dispatch, { record }) },
    onEditClick: (record, edittype) => { onCommitEdit(dispatch, { record, edittype }) },
    SelectByREQ: (page, limit, req) => { onLoadTargetListByREQ(dispatch, { page, limit, req }) },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ZyRentDetailList)

