import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message, Modal, Spin } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../demos/home.scss'
import { RentToMergeData, onLoadTargetRent, onShowDetail, onCommitEdit, toSelectDetail,onLoadTargetListByREQ2,onCleanRentlist } from '../../../store/actions/zyCollectionAct';
import { connect } from 'react-redux';
import {  parseItemtype, parseTypeToLabel, consoleTarget, parseInputNode } from '../../../utils/ItemUtils';
//import { rentMergeQuery } from '../../../utils/common';
import { getTodayDateStr } from '../../../utils/common';

const cols = sysCols.MergeRentCol.filter(item => item.isShow);

const selectReqs = sysCols.MergeRentCol.filter(item => item.isSelect);

const modalCols = sysCols.rentCol.filter(item => (item.isShow && !item.isOper) );

//const renttypes = selectItems.renttypes;

const { Option } = Select;


const ZyRentList = (props) => {

  //console.log(props);
  const [form] = Form.useForm();

  const [rentForm] = Form.useForm();

  const [invoiceForm] = Form.useForm();

  const [isInit, setIsInit] = useState(true);

  const [date, setDate] = useState('');

  const EditableCell = ({
    labelType,
    children,
    dataIndex,
    record,
    isWarn,
    ...restProps
  }) => {

    return (
      <td {...restProps} type='primary' className={(isWarn) ? 'warn' : ''}>

        {parseTypeToLabel(record, dataIndex, children)}
      </td>
    );
  };





  const mergedColumns = cols => cols.map(col => {
    // eslint-disable-next-line default-case
    switch (col.dataIndex) {
      case "operation":
        col.render = (text, record) => {
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
          );
        }
        break;
      case "isOwe":
        col.render = (text, record, index) => {
          if (text > 0) {
            return (
              <span className=''>
              {/* <Popconfirm title='确认打开?' onConfirm={() => {
                    //del(record)
                    console.log('确认打开！！！！');
                    modalDetails();
                  }}
                  > */}
                <span key={index} style={{ textDecorationLine: 'underline' }}
                  onClick={() => {
                    //onClickOweInvoice(record.contractno, 2, 0);
                    getTargetOweInvoice(0,0,{contractid:record.contractid,amount_select:'2',
                    invoice_select:'0'})
                  //  console.log('累计未收！');
                    
                  }
                  }>
                  {text}
                </span>
                {/* </Popconfirm> */}
              </span>
            );
          }
          else {
            return (
              <span className=''><li>{text}</li></span>
              
            )
          }
        }

        break;
      case "needInvoice":
        col.render = (text, record,index) => {
          if(text > 0){

            return (
              <span className=''>
              <span key={index} style={{textDecorationLine:'underline'}} 
                onClick={()=>{
                getTargetOweInvoice(0,0,{contractid:record.contractid,amount_select:'0',
                invoice_select:'2'})
                }}
                >
                  {text}
              </span>
              </span>
            );
          }
          else{
            return (
              <span className=''>
              <li>{text}</li>
              </span>
            )
          }

        }
        break;
    }

    return {
      ...col,
      align:'center',
      onCell: (record, rowIndex) => (

        {
          //record,
          labelType: parseItemtype(col.dataIndex),
          rowIndex,
          isWarn: record.isWarn ? true : false,
          //isWarn:consoleTarget(record),
          dataIndex: col.dataIndex,
          title: col.title,
          record
        }
      )
    };
  });


  const { onLoadTartgetData, SelectByREQ, onShowOne, onEditClick, 
  getTargetOweInvoice,onLoadData,onCleanModal} = props;

  const {list, page, total, limit,  isLoading, mode} = props.zyCollectionData;

  const {targetRentlist,completeRentlist} = props.zyContractData;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    if(completeRentlist){
      modalDetails();
      return;
    }
    

    message.info('加载中...');

    switch (mode) {
      case 'detailselect':
        props.history.push('/admin/zyRentDetailList');
        return;

      default:
        break;
    }

    setDate(getTodayDateStr);

    if (isInit) {

      // console.log(' Init = ' + isInit);
      onLoadData(1, -1, { isInit, contract_status: -2 });
      setIsInit(false);
    }
    else {
      let reqs = form.getFieldsValue();
      onLoadData(page, limit, reqs);
    }



  }, [mode,targetRentlist])


  //收款
  const getRent = record => {

    Modal.confirm({
      title: '收款',
      visible: true,

      content: (
        <Form form={rentForm} layout="vertical"
          initialValues={{
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
        let values = rentForm.getFieldsValue();
        record.totalrealAmount = record.totalrealAmount - record.amount_received + values.amount;
        record.amount_received = values.amount;
        record.collectdate = values.collectdate;
        record.isOwe = record.totalneedAmount - record.totalrealAmount;
        if (record.isOwe <= 0) {
          record.isOwe = '无欠费';
        }
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
        <Form form={invoiceForm} layout="vertical" name="userForm"
          initialValues={{
            //['amount']: '3',
            'invoicedate': date
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
        let values = invoiceForm.getFieldValue();
        record.totalrealInvoice = record.totalrealInvoice - record.invoice_amount + values.amount;
        record.invoice_amount = values.amount;
        record.invoicedate = values.invoicedate;
        record.needInvoice = record.totalneedInvoice - record.totalrealInvoice;
        if (record.needInvoice <= 0) {
          record.needInvoice = '无欠票';
        }
        onEditClick(record, 'COMMIT_GetInvoice')
      },
      onCancel() { },

      okText: '提交',
      cancelText: '取消'
    });
  }

  //弹窗出详细账单
  const modalDetails = (record, index) => {   


    const EditableCell = ({
      labelType,
      dataIndex,
      children,
      record,
      isWarn,
      ...restProps
    }) => {

      return (
        <td {...restProps} type='primary' className=''>

          {parseTypeToLabel(record, dataIndex, children)}
        </td>
      );
    };


    const modalColumns = cols => cols.map(col => {
      if (!col.editable) {
        if (col.isOper === true) {
          col.render = (text, record, index) => {
          }
        }

        return col;
      }

      return {
        ...col,
        onCell: (record, rowIndex) => (

          {
            labelType: parseItemtype(col.dataIndex),
            rowIndex,
            isWarn: record.isWarn ? true : false,
            dataIndex: col.dataIndex,
            title: col.title,
            record
          }
        )
      };
    });


    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //     setTarget(selectedRows[0]);

    //   },
    //   getCheckboxProps: (record) => ({
    //   }),
    // };

    Modal.info({
      title: '',
      visible: true,
      width: '80%',
      size: 'lager',
      height: '80%',
      // style:{width:'80%',height:'1000px'},       
      content: (
        <Card title='账单列表'>

          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            // rowSelection={{
            //   type: "radio",
            //   ...rowSelection,
            // }}
            rowKey="id"
            bordered
            columns={modalColumns(modalCols)}
            dataSource={targetRentlist}
            size="lager"
            style={{ width: '100%', height: '100%' }}
            pagination={{

              total,
              showSizeChanger: false,
              onChange: (p,size) => {
             //   loadContractList(p, size);
              },
              onShowSizeChange: (current, size) => {
              //  loadContractList(1, size);
              }
            }
            }
            scroll={{ y: 350 }}
          />

        </Card>
      ),
      onOk() {
       // console.log('mode = ' + mode);
       onCleanModal();
      },
      //onCancel() { },

      okText: '好的',
     // cancelText: '取消'
    });

  }


  const getOwe = record => {
    //设置要编辑的id
    onLoadTartgetData(page, limit, record);

    props.history.push('/admin/zyRentDetailList');



  };

  const getNeedInvoice = record => {
    //设置要编辑的id
    onLoadTartgetData(page, limit, record);

    props.history.push('/admin/zyRentDetailList');



  };

  //详情
  const loadDetail = record => {
    onShowOne(record);
    props.history.push('/admin/zyRentDetail/edit');
  }



  const ResetValue = () => {
    form.resetFields();
  }

  /**
   * 筛选
   */
  const onSelectByParams = () => {

    let reqs = form.getFieldsValue();

    //SelectByREQ(tenant,month_rent,isOwe,needInvoice,page,limit);
    SelectByREQ(page, limit, reqs);
  }

  /**
   * 筛选
   */
  const onChangePageOrSize = (p, size) => {
    let reqs = form.getFieldsValue();

    SelectByREQ(p, size, reqs);
  }


  return (
    <Card title="本期概况列表">

      <Spin spinning={isLoading ? true : false} >
        <Form
          form={form}
          layout="inline"
          className="components-table-demo-control-bar"
          style={{ marginBottom: 16 }}
        >
          {selectReqs.map(item => {
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
              onChangePageOrSize(p, size);
            },
            onShowSizeChange: (current, size) => {
              onChangePageOrSize(1, size);
            }
          }
          }
          scroll={{ y: 350 }}
        />
      </Spin>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch, ownprops) => {
  return {
    onClickOweInvoice: (contractno, isOwe, needInvoice) => { toSelectDetail(dispatch, { contractno, isOwe, needInvoice }) },
    onShowOne: (record) => { onShowDetail(dispatch, { record }) },
    onEditClick: (record, edittype) => { onCommitEdit(dispatch, { record, edittype }) },
    onLoadData: (page, limit, req) => { RentToMergeData(dispatch, { page, limit, req }) },
    onLoadTartgetData: (page, limit, record) => { onLoadTargetRent(dispatch, { page, limit, record }) },
    SelectByREQ: (page, limit, req) => { RentToMergeData(dispatch, { page, limit, req }) },
    getTargetOweInvoice:(page,limit,req) =>{onLoadTargetListByREQ2(dispatch,{page,limit,req})},
    onCleanModal:()=>{onCleanRentlist(dispatch)},
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ZyRentList)

