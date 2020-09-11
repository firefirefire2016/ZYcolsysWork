import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../home.scss'
import { onLoadContractData,RentToMergeData } from '../../../store/actions/zyCollectionData';
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode } from '../../../utils/ItemUtils';

const cols = sysCols.MergeRentCol.filter(item => item.isShow);

//const renttypes = selectItems.renttypes;

const { Option } = Select;


const ZyRentList = (props) => {

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
      <td {...restProps} type='primary' className='' className={(isWarn )?'warn':''}>

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

  const { list, page, total, limit,onLoadData } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    message.info('加载中...');  

    setTimeout(() => {
    }, 1000);

    onLoadData(1, limit);

    console.log(props);

    

  }, [])


  const edit = record => {

    //设置要编辑的id
    // onEditClick(record, false);
    // props.history.push('/admin/zyContract/edit');


  };

  const ResetValue = () => {
    form.resetFields();
  }

  /**
   * 筛选
   */
  const onSelectByParams = ()=>{

  }

  return (
    <Card title="账单列表">


      <Form
        form={form}
        layout="inline"
        className="components-table-demo-control-bar"
        style={{ marginBottom: 16 }}
      >
        <Form.Item
          name="contractno"
          label='筛选条件1'
        >
          <Input placeholder="筛选条件1" type="text"

          />
        </Form.Item>


        <Form.Item
          label='筛选条件2'
          name="renttype"
        >
          <Select style={{ width: 150 }}
          >
            {/* {renttypes.map((type, index) => (
              <Option key={index} value={index}>{type}</Option>
            ))} */}
          </Select>
        </Form.Item>

        <Form.Item
          label='筛选条件3'
          name="startdate"
          marginRight='20px'
        >
          <Input
            className="site-form-item-icon"
            type="date"
            placeholder="筛选条件3"
          />
        </Form.Item>

        <Form.Item
          name="enddate"
          label='筛选条件4'
        >
          <Input
            type="date"
            placeholder="筛选条件4"
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
  return state.zyCollectionData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
  return {
    onLoadData: (page, limit) => { RentToMergeData(dispatch, {page, limit}) },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ZyRentList)

