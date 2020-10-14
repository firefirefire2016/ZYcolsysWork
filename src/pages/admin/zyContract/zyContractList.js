import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message,Modal, Spin } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../demos/home.scss'
import { onLoadContractData, onGetEditData, onCreateData, onCommitUpdateStatus,onShowDetail,
  onCommitStatus,onContinueContract,onStartEffect,keepFormdata } from '../../../store/actions/zyContractAct';
import { increaseAction } from '../../../store/actions/zyCounter';
import { connect } from 'react-redux';
import { parseItemtype, parseTypeToLabel, parseInputNode, consoleTarget } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common'


const cols = sysCols.contractCol.filter(item => item.isShow);

const selectItems = sysCols.contractCol.filter(item => item.isSelect);

const { Option } = Select;


const ZyContractList = (props) => {

  //console.log(props);
  const [form] = Form.useForm();

  const [refundForm] = Form.useForm();

  const [isInit, setIsInit] = useState(true);


  //const [ ] = useState(true);

  const EditableCell = ({
    labelType,
    dataIndex,
    children,
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
    if (!col.editable) {
      if (col.isOper === true) {
        col.render = (text, record, index) => {
          switch (record.contract_status) {
            case 0://未生效
              return (
                <span className=''>
                  <Popconfirm title='确定启用该合同么?' onConfirm={() => {
                     startUse(record);
                  }}
                  >
                  <Button type="primary" style={{ marginRight: 8 }}>
                      启 用
                  </Button>
                  </Popconfirm>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => edit(record)}>
                    编 辑
                  </Button>
                  <Popconfirm title='确定删除该合同么?' onConfirm={() => {
                      del(record)
                  }}
                  >
                  <Button type="primary" style={{ marginRight: 8 }}>
                    删 除
                  </Button>
                  </Popconfirm>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => detail(record)}>
                    详 情
                </Button>
                </span>
              );
            case 1://已生效
              return (
                <span className=''>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => { refundRent(record) }} >
                    退 租
                  </Button>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => { stopContract(record) }}>
                    停 用
                  </Button>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => { onDetailClick(record)}}>
                    详 情
                  </Button>
                </span>
              );
            case 2://即将到期
              return (
                <span className=''>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => {refundRent(record) }} >
                    退 租
                </Button>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => { stopContract(record) }}>
                    停 用
                </Button>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => { keepOn(record)}}>
                    续 租
                </Button>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => {onDetailClick(record) }}>
                    详 情
                </Button>
                </span>
              );
            case 3://已到期
              return (
                <span className=''>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => { stopContract(record) }}>
                    停 用
                </Button>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => { keepOn(record)}}>
                    续 租
                </Button>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => { onDetailClick(record)}}>
                    详 情
                </Button>
                </span>
              );
            case 4://已失效
              return (
                <span className=''>
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => {onDetailClick(record) }}>
                    详 情
                </Button>
                </span>
              );
            default:
              break;
          }

        }
      }


      //return col;
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
          dataIndex: col.dataIndex,
          title: col.title,
          record
        }
      )
    };
  });

  const { list, page, total, limit, onLoadData, onCreateClick, onUseClick,contract_status,record,
    onEditClick, res, onConfirmDel,onDetailClick,mode,onStatusClick,onContinueClick,isLoading } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    

    //console.log(' props = ' + JSON.stringify(props) );
    switch (mode) {
      case 'details':
        props.history.push('/admin/zyContract/edit');
        return;
      case 'editing':
        //console.log(' mode = ' + mode );
        props.history.push('/admin/zyContract/edit');
        return;
      case 'keepon':
        props.history.push('/admin/zyContract/edit');
        return;
      case 'refunded':
        return;
      case 'started':
        return;
      case 'stoped':
        return;
      case 'deled'://删除后需要刷新列表不能return
        break;
      case 'creating':
        props.history.push('/admin/zyContract/edit');
        return;
      default:
        break;
    }

    //message.info('加载中...');

    if (isInit) {

      // console.log(' Init = ' + isInit);
      onLoadData(1, -1, { isInit, contract_status: -2 });
      setIsInit(false);
    }
    else {
      let row = form.getFieldValue();

      onLoadData(1, limit, row);
    }

  }, [mode])

  //创建
  const create = () => {
    onCreateClick();
    
  }

  //启用
  const startUse = record =>{
    onUseClick(record);
  }

  //退租
  const refundRent = record =>{

    Modal.confirm({
      title: '退租',
      visible: true,

      content: (
        <Form form={refundForm} layout="vertical" name="userForm"
          initialValues={{
          }}
          onFinish={values => {
          }}
        >
          <Form.Item
            name="quitdate"
            label="退租日期"
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
        let values = refundForm.getFieldsValue();
        let _record = {};
        _record.id = record.id;
        _record.quitdate = timeToStr(values.quitdate);
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        if(month < 10){
          month = '0' + month;
        }
        if(day < 10){
          day = '0' + day;
        }
        let stopdate = year + month + day;
        _record.stopdate = stopdate;
        _record.stopreason = '退租';
        _record.contract_status = 4;
        onStatusClick(record, _record,'COMMIT_REFUND');
      },
      onCancel() { },

      okText: '提交',
      cancelText: '取消'
    });

  }

  //停用
  const stopContract = record =>{

    Modal.confirm({
      title: '停用',
      visible: true,

      content: (
        <Form form={refundForm} layout="vertical" name="userForm"
          initialValues={{
          }}
          onFinish={values => {
          }}
        >
          <Form.Item
            name="stopreason"
            label="停用原因"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type={'text'} style={{ width: '200px' }} />
          </Form.Item>
        </Form>
      ),
      onOk() {
        let values = refundForm.getFieldsValue();
        let _record = {};
        _record.id = record.id;
        _record.stopreason = values.stopreason;
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        if(month < 10){
          month = '0' + month;
        }
        if(day < 10){
          day = '0' + day;
        }
        let stopdate = year + month + day;
        _record.stopdate = stopdate;
        _record.contract_status = 4;
        onStatusClick(record,_record,'COMMIT_STOP');
      },
      onCancel() { },

      okText: '提交',
      cancelText: '取消'
    });

  }

  //详情
  const detail = record => {

    //设置要编辑的id
    onDetailClick(record);
    


  };

  //删除
  const del = record => {
    let _record = {};
    _record.id = record.id;
    _record.contract_status = -1;
    onStatusClick(record,_record,'COMMIT_DEL'); 

  };

  //编辑
  const edit = record => {

    onEditClick(record); 

  };

  //续租
  const keepOn = record =>{

    onContinueClick(record);

  }

  //重置
  const ResetValue = () => {
    form.resetFields();
    console.log(list);
  }

  const onSelectByParams = () => {
    let row = form.getFieldValue();
    let { startdate, enddate } = row;

    console.log(startdate);

    if (startdate && startdate.indexOf('-') !== -1) {
      row.startdate = startdate.replace(/-/g, "");
    }

    if (enddate && enddate.indexOf('-') !== -1) {
      row.enddate = enddate.replace(/-/g, "");
    }

    let req = { ...row };

    console.log(row);

    if (startdate) {
      var str = row.startdate;

      row.startdate = strToTime(str);
    }

    if (enddate) {
      var str2 = row.enddate;

      row.enddate = strToTime(str2);
    }

    if (!req.contract_status && req.contract_status !== 0) {
      req.contract_status = -2;
    }

    onLoadData(1, limit, req);

  }

  return (
    <Card title="合同列表"
      extra={

        <Button type="primary" size="large" onClick={create}>
          新增合同
           </Button>

      }>

<Spin spinning={isLoading? true : false} >
      <Form
        form={form}
        layout="inline"
        className="components-table-demo-control-bar"
        style={{ marginBottom: 16 }}
      >
        {selectItems.map(item => {
          return (
            <Form.Item
              name={item.dataIndex}
              label={item.title}
              // rules={[
              //   {
              //     //required: true,
              //     message: item.title,
              //   },
              // ]}
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
          onChange: (p) => {

            let row = form.getFieldValue();

            onLoadData(p, limit,row);
            


          },
          onShowSizeChange: (current, size) => {
            let row = form.getFieldValue();
            onLoadData(1, size,row);
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
  return state.zyContractData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
  return {
    
    onUseClick:(record) =>{onStartEffect(dispatch,{record})},
    onContinueClick: (record) => { onContinueContract(dispatch, { record}) },
    onStatusClick: (record,_record,edittype) => { onCommitStatus(dispatch, { record,_record,edittype}) },
    onLoadData: (page, limit, req) => { onLoadContractData(dispatch, { page, limit, req }) },
    onDetailClick: (record) => { onShowDetail(dispatch, { record}) },
    onEditClick: (record) => { onGetEditData(dispatch, { record}) },
    onCreateClick: (isCreating) => { onCreateData(dispatch, { isCreating }) },
    //onConfirmDel: (id, contract_status, page, limit) => { onCommitUpdateStatus(dispatch, { id, contract_status, page, limit }) }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ZyContractList)

