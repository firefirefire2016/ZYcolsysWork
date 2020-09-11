import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../home.scss'
import { onLoadContractData, onGetEditData, onCreateData,onCommitUpdateStatus } from '../../../store/actions/zyContractData';
import { increaseAction } from '../../../store/actions/zyCounter';
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode } from '../../../utils/ItemUtils';
import { strToTime,timeToStr } from '../../../utils/common'
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
                onConfirm={()=>onConfirmDel(record.id,2,page,limit)}
                title='确定终止该合同么?'
                disabled={record.status === 2}
              >
                <Button type="primary" disabled={record.status === 2}
                  style={{
                    marginRight: 8,
                  }}>
                  终止
                </Button>
              </Popconfirm>

              <Popconfirm
                title='确定删除该合同么?'
                onConfirm={()=>{
                  onConfirmDel(record.id,-1,page,limit)
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

  const { list, page, total, limit, onLoadData, onCreateClick, onEditClick, res,onConfirmDel } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    message.info('加载中...');  

    //onLoadData(page, limit);
    setTimeout(() => {
      onLoadData(1, limit);
    }, 1000);

    console.log(props);

    

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

  const onSelectByParams = ()=>{
    let row = form.getFieldValue();
    let {contractno,renttype,startdate,enddate} = row;

    console.log('row=' + JSON.stringify(row) );

    if(startdate){
      startdate = parseInt(startdate.replace(/-/g, ""));
    }
    
    if(enddate){
      enddate = parseInt(enddate.replace(/-/g, ""));
    }

    console.log(startdate  + '  ' + enddate);

    onLoadData(page,limit,contractno,renttype,startdate,enddate);

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
          label='招租方式'
          name="renttype"

          // rules={[
          //   {
          //     message: '请选择招租方式',
          //   }]}
        >
          <Select style={{ width: 150 }}
          >
            {renttypes.map((type, index) => (
              <Option key={index} value={index}>{type}</Option>
            ))}
          </Select>
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
    onLoadData: (page, limit,contractno,renttype,startdate,enddate) => { onLoadContractData(dispatch, {page, limit,contractno,renttype,startdate,enddate}) },
    onIncreaseClick: () => { increaseAction(dispatch, ownprops) },
    onEditClick: (record, isCreating) => { onGetEditData(dispatch, { record, isCreating }) },
    onCreateClick: (isCreating) => { onCreateData(dispatch, { isCreating }) },
    onConfirmDel:(id,status,page,limit) => { onCommitUpdateStatus(dispatch,{id,status,page,limit}) }
  }
}

//connect(mapStateToProps)(ModalForm)

export default connect(mapStateToProps, mapDispatchToProps)(ZyContractList)

