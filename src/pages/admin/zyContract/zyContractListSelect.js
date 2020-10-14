import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message,Modal, Spin } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../demos/home.scss'
import { onLoadContractData, onGetEditData, onCreateData, onCommitUpdateStatus,onShowDetail,
  onCommitStatus,onContinueContract,onStartEffect,keepFormdata,onSelectToRent } from '../../../store/actions/zyContractAct';
import { increaseAction } from '../../../store/actions/zyCounter';
import { connect } from 'react-redux';
import { parseItemtype, parseTypeToLabel, parseInputNode, consoleTarget } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common'


const cols = sysCols.contractCol.filter(item => (item.isShow && !item.isOper) );

const selectItems = sysCols.contractCol.filter(item => item.isSelect);

const { Option } = Select;


const ZyContractList = (props) => {

  //console.log(props);
  const [form] = Form.useForm();

  const [refundForm] = Form.useForm();

  const [isInit, setIsInit] = useState(true);

  const [target, setTarget] = useState({});


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
      <td {...restProps} type='primary' className=''>

        {parseTypeToLabel(record, dataIndex, children)}
      </td>
    );
  };


  const mergedColumns = cols => cols.map(col => {
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


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
     // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setTarget(selectedRows[0]);
    },
    getCheckboxProps: (record) => ({
    }),
  };

  const { list, page, total, limit, onLoadData, onEditClick, onDetailClick,onChangeRow,
    onStatusClick,onContinueClick,isLoading,selectmode} = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    
    switch (selectmode) {
      case 'backrent':
        props.history.push('/admin/zyRentDetail/edit');

        return;
      case 'toselect':
        //props.history.push('/admin/propertyRight/select');
        break;

      default:
        break;
    }

    if (isInit) {

      // console.log(' Init = ' + isInit);
      onLoadData(1, -1, { isInit, contract_status: -2 });
      setIsInit(false);
    }
    else {
      let row = form.getFieldValue();
      onLoadData(1, limit, row);
    }

  }, [selectmode])

 

  //重置
  const ResetValue = () => {
    form.resetFields();
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

    onLoadData(page, limit, req);

  }

  return (
    <Card title="合同列表">

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
        rowSelection={{
          type: "radio",
          ...rowSelection,
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
      <Button size='large' type="primary" style={{
        marginLeft: '40%'
      }}
        onClick={() => {
          onChangeRow(target);
        }}
      >保存</Button>
      <Button size='large' type="primary" style={{
        marginLeft: '5%'
      }}
        onClick={() => {
          onChangeRow(target);
        }}
      >取消</Button>
      </Spin>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return state.zyContractData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
  return {
    onChangeRow: (record) => { onSelectToRent(dispatch, { record }) },
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

