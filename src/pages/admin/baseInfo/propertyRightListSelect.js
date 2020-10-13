import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message, AutoComplete } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../demos/home.scss'
import { onLoadTargetListByREQ, onShowDetail, onEditDetail, onCreateData, onCommitUpdateStatus, onSelectToContract } from '../../../store/actions/zyPropertyAct';
import { increaseAction } from '../../../store/actions/zyCounter';
import { connect } from 'react-redux';
import { parseItemtype, parseTypeToLabel, parseInputNode } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common';
import Modal from 'antd/lib/modal/Modal';

const cols = sysCols.propertyCol.filter(item => item.isShow);

const selectItems = sysCols.propertyCol.filter(item => (item.isSelect && !item.selectMode));


const { Option } = Select;




const PropertyRightList = (props) => {

  //console.log(props);
  const [form] = Form.useForm();

  const [isInit, setIsInit] = useState(true);

  const [target, setTarget] = useState(null);

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


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // let obj = new Object(selectedRows[0]);
      // setTarget(obj);
      // console.log(JSON.stringify(selectedRows[0]) );
      // let obj = new Object(selectedRows[0]);
      //onChangeRow(selectedRows[0]);
      setTarget(selectedRows[0]);

    },
    getCheckboxProps: (record) => ({
      //console.log('record' + record);
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };


  const mergedColumns = cols => cols.map(col => {
    if (!col.editable) {
      if (col.isOper === true) {

      }
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

  const { list, page, total, limit, onLoadData, onCreateClick, onDetailClick,
    onEditClick, res, onConfirmDel, onChangeRow, selectmode,rightno } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    // console.log(mode);

    switch (selectmode) {
      case 'backcontract':
        props.history.push('/admin/zyContract/edit');

        return;
      case 'toselect':
        //props.history.push('/admin/propertyRight/select');
        break;

      default:
        break;
    }

    if (isInit) {

      onLoadData(1, -1, { isInit,property_status:1 },rightno);
      setIsInit(false);
    }
    else {
      onLoadData(1, limit, { isInit,property_status:1  },rightno);
    }




  }, [selectmode])

  const create = () => {
    onCreateClick(true);
    props.history.push('/admin/propertyRight/createOne');
  }

  //详情
  const loadDetail = record => {
    onDetailClick(record);
    props.history.push('/admin/propertyRight/edit');
  }


  const edit = record => {

    //设置要编辑的id
    onEditClick(record, false);
    props.history.push('/admin/propertyRight/edit');


  };

  const ResetValue = () => {
    form.resetFields();
  }

  const onSelectByParams = () => {
    let row = form.getFieldValue();
    // let { contractno, renttype, startdate, enddate } = row;

    console.log('row=' + JSON.stringify(row));

    onLoadData(page, limit, row);

  }

  return (
    <Card title="产权列表"
    // extra={

    //   <Button type="primary" size="large" onClick={create}>
    //     新增产权
    //      </Button>

    // }
    >


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
              rules={[
                {
                  required: true,
                  message: item.title,
                },
              ]}
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
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
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
      <Button size='large' type="primary" style={{
        marginLeft: '40%'
      }}
        onClick={() => {
          //console.log(target);
          if(target === null){
            
            onChangeRow(rightno);
          }
          else{
            
            onChangeRow(target);
          }
          
        }}
      >保存</Button>
      <Button size='large' type="primary" style={{
        marginLeft: '5%'
      }}
        onClick={() => {
          onChangeRow(rightno);
        }}
      >取消</Button>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return state.zyPropertyData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
  return {
    // onSaveClick: (record) => { onGetEditData(dispatch, { record}) },
    onLoadData: (page, limit, req,rightno) => { onLoadTargetListByREQ(dispatch, { page, limit, req,rightno}) },
    onChangeRow: (record) => { onSelectToContract(dispatch, { record }) },
    onDetailClick: (record, isCreating) => { onShowDetail(dispatch, { record, isCreating }) },
    onEditClick: (record, isCreating) => { onEditDetail(dispatch, { record, isCreating }) },
    onCreateClick: (isCreating) => { onCreateData(dispatch, { isCreating }) },
    onConfirmDel: (id, property_status, page, limit) => { onCommitUpdateStatus(dispatch, { id, property_status, page, limit }) }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PropertyRightList)


