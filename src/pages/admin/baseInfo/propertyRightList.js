import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message, Spin } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../demos/home.scss'
import { onLoadTargetListByREQ, onShowDetail, onEditDetail, onCreateData, onCommitUpdateStatus } from '../../../store/actions/zyPropertyAct';
import { increaseAction } from '../../../store/actions/zyCounter';
import { connect } from 'react-redux';
import { parseItemtype, parseTypeToLabel, parseInputNode } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common'
import Modal from 'antd/lib/modal/Modal';

const cols = sysCols.propertyCol.filter(item => item.isShow);

const selectItems = sysCols.propertyCol.filter(item => item.isSelect);


const { Option } = Select;


const PropertyRightList = (props) => {

  //console.log(props);
  const [form] = Form.useForm();

  const [isInit, setIsInit] = useState(true);

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

              <Button type="primary"
                style={{
                  marginRight: 8,
                }}
                onClick={()=>loadDetail(record)}
                >
                详情
                </Button>

              <Popconfirm
                title='确定删除该产权么?'
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

  const { list, page, total, limit, onLoadData, onCreateClick, onDetailClick,isLoading,
    onEditClick, res, onConfirmDel } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    //message.info('加载中...');

    if (isInit) {


      onLoadData(1, -1, { isInit });
      setIsInit(false);
    }
    else {
      let row = form.getFieldValue();
      onLoadData(page, limit, row);
    }


  }, [])

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

   // console.log('row=' + JSON.stringify(row));
    
    onLoadData(page, limit, row);

  }

  return (
    <Card title="产权列表"
      extra={

        <Button type="primary" size="large" onClick={create}>
          新增产权
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
          
          onChange: (p,size) => {
            let row = form.getFieldValue();
            onLoadData(p, size,row);
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
  return state.zyPropertyData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
  return {
    onLoadData: (page, limit, req) => { onLoadTargetListByREQ(dispatch, { page, limit, req }) },

    onDetailClick: (record, isCreating) => { onShowDetail(dispatch, { record, isCreating }) },
    onEditClick: (record, isCreating) => { onEditDetail(dispatch, { record, isCreating }) },
    onCreateClick: (isCreating) => { onCreateData(dispatch, { isCreating }) },
    onConfirmDel: (id, property_status, page, limit) => { onCommitUpdateStatus(dispatch, { id, property_status, page, limit }) }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PropertyRightList)


