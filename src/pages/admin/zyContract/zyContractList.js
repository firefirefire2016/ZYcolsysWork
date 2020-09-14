import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../demos/home.scss'
import { onLoadContractData, onGetEditData, onCreateData, onCommitUpdateStatus } from '../../../store/actions/zyContractData';
import { increaseAction } from '../../../store/actions/zyCounter';
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode, consoleTarget } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common'
import Modal from 'antd/lib/modal/Modal';

const cols = sysCols.contractCol.filter(item => item.isShow);

const renttypes = selectItems.renttypes;

const { Option } = Select;


const ZyContractList = (props) => {

  //console.log(props);
  const [form] = Form.useForm();

  const EditableCell = ({
    labelType,
    children,
    record,
    isWarn,
    ...restProps
  }) => {

    return (
      <td {...restProps} type='primary' className=''>

        {parseTypeToLabel(record, labelType, children)}
      </td>
    );
  };





  const mergedColumns = cols => cols.map(col => {
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
                编辑
                </Button>



              <Popconfirm
                onConfirm={() => onConfirmDel(record.id, 0, page, limit)}
                title='确定终止该合同么?'
                disabled={record.contract_status === 0}
              >
                <Button type="primary" disabled={record.contract_status === 0}
                  style={{
                    marginRight: 8,
                  }}>
                  终止
                </Button>
              </Popconfirm>

              <Popconfirm
                title='确定删除该合同么?'
                onConfirm={() => {
                  onConfirmDel(record.id, -1, page, limit)
                }}
              >
                <Button type="primary"

                  style={{
                    marginRight: 8,
                  }}>
                  删 除
                </Button>
              </Popconfirm>

            </span>
          );
        }
      }


      return col;
    }

    return {
      ...col,
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

  const { list, page, total, limit, onLoadData, onCreateClick, onEditClick, res, onConfirmDel } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    message.info('加载中...');

    console.log(props);

    //onLoadData(page, limit);
    setTimeout(() => {
      onLoadData(1, limit,{contract_status:-2});
    }, 1000);

    //console.log(props);



  }, [])

  const create = () => {
    onCreateClick(true);
    props.history.push('/admin/zyContract/createOne');
  }


  const edit = record => {

    //设置要编辑的id
    onEditClick(record, false);
    props.history.push('/admin/zyContract/edit');


  };

  const ResetValue = () => {
    form.resetFields();
  }

  const onSelectByParams = () => {
    let row = form.getFieldValue();
    let { startdate, enddate } = row;

    console.log(startdate);

    if (startdate && startdate.indexOf('-')!==-1) {      
      row.startdate = startdate.replace(/-/g, "");
    }

    if (enddate && enddate.indexOf('-')!==-1) {
      row.enddate = enddate.replace(/-/g, "");
    }    

    let req = {...row};

    console.log(row);

    if(startdate){
      var str = row.startdate;

      row.startdate = strToTime(str);
    }

    if(enddate){
      var str2 = row.enddate;

      row.enddate = strToTime(str2);
    }

    if(!req.contract_status && req.contract_status !== 0){
      req.contract_status = -2;
    }

    onLoadData(page, limit, req);

  }

  return (
    <Card title="合同列表"
      extra={

        <Button type="primary" size="large" onClick={create}>
          新增合同
           </Button>

      }>


      <Form
        form={form}
        layout="inline"
        className="components-table-demo-control-bar"
        style={{ marginBottom: 16 }}
      >
        <Form.Item
          name="contractno"
          label='合同编号'
          rules={[
            {
              message: '请输入合同编号',
            },
          ]}
        >
          <Input placeholder="合同编号" type="text"

          />
        </Form.Item>

        <Form.Item
          label='地址'
          name="address"
        >
          <Input placeholder="地址" type="text"

          />
        </Form.Item>

        <Form.Item
          label='对接人'
          name="agentman"
        >
          <Input placeholder="对接人" type="text"

          />
        </Form.Item>

        <Form.Item
          label='承租方'
          name="tenant"
        >
          <Input placeholder="承租方" type="text"

          />
        </Form.Item>

        <Form.Item
          label='起始日期'
          name="startdate"
          marginRight='20px'
          rules={[
            {
              message: '请输入起始日期',
            },
          ]}
        >
          <Input
            className="site-form-item-icon"
            type="date"
            placeholder="起始日期"
          />
        </Form.Item>

        <Form.Item
          name="enddate"
          label='终止日期'
          rules={[
            {
              message: '请输入终止日期',
            },
          ]}
        >
          <Input
            type="date"
            placeholder="终止日期"
          />
        </Form.Item>

        <Form.Item
          label='合同状态'
          name="contract_status"
        >
          <Select style={{ width: 150 }}
          >
            {selectItems.contract_status.map((type, index) => (
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
  return state.zyContractData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
  return {
    onLoadData: (page, limit, req) => { onLoadContractData(dispatch, { page, limit, req }) },
    onIncreaseClick: () => { increaseAction(dispatch, ownprops) },
    onEditClick: (record, isCreating) => { onGetEditData(dispatch, { record, isCreating }) },
    onCreateClick: (isCreating) => { onCreateData(dispatch, { isCreating }) },
    onConfirmDel: (id, contract_status, page, limit) => { onCommitUpdateStatus(dispatch, { id, contract_status, page, limit }) }
  }
}

//connect(mapStateToProps)(ModalForm)

export default connect(mapStateToProps, mapDispatchToProps)(ZyContractList)

