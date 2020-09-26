import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../demos/home.scss'
import {  RentToMergeData, onLoadTargetRent } from '../../../store/actions/zyCollectionAct';
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, consoleTarget,parseInputNode } from '../../../utils/ItemUtils';
import { rentMergeQuery } from '../../../utils/common';

const cols = sysCols.MergeRentCol.filter(item => item.isShow);

const selectReqs = sysCols.MergeRentCol.filter(item => item.isSelect);

//const renttypes = selectItems.renttypes;

const { Option } = Select;


const ZyRentList = (props) => {

  //console.log(props);
  const [form] = Form.useForm();

  const [isInit, setIsInit] = useState(true);

  const EditableCell = ({
    labelType,
    children,
    record,
    isWarn,
    ...restProps
  }) => {

    return (
      <td {...restProps} type='primary' className='' className={(isWarn) ? 'warn' : ''}>

        {parseTypeToLabel(record, labelType, children)}
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
                onClick={() => edit(record)}
              >
                查看账单
                </Button>

            </span>
          );
        }
        break;
      case "totalAmount":
        col.render = (text, record,index) => {
          return (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a key={index} className='' onClick={()=>{console.log('这里啊累计收款总额')}}>
              {text}
            </a>
          );
        }
    }

    return {
      ...col,
      onCell: (record, rowIndex) => (

        {
          //record,
          labelType: parseItemtype(col.dataIndex),
          rowIndex,
          isWarn: record.isWarn === 1 ? true : false,
          //isWarn:consoleTarget(record),
          dataIndex: col.dataIndex,
          title: col.title,
          record
        }
      )
    };
  });


  const { list, page, total, limit, onLoadData, onLoadTartgetData, SelectByREQ } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    message.info('加载中...');



    setTimeout(() => {
    }, 1000);

    if (isInit) {

      // console.log(' Init = ' + isInit);
      onLoadData(1, -1, { isInit, contract_status: -2 });
      setIsInit(false);
    }
    else {
      onLoadData(1, limit, { isInit, contract_status: -2 });
    }



  }, [])




  const edit = record => {
    //设置要编辑的id
    onLoadTartgetData(page, limit, record);

    props.history.push('/admin/zyRentDetailList');



  };



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

    SelectByREQ(p, size,reqs);
  }


  return (
    <Card title="本期概况列表">


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
                rules={[
                  {
                    required: true,
                    message: item.title,
                  },
                ]}
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
          onChange: (p,size) => {
            onChangePageOrSize(p, size);
          },
          onShowSizeChange: (current, size) => {
            onChangePageOrSize(1, size);
          }
        }
        }
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
    onLoadData: (page, limit, req) => { RentToMergeData(dispatch, { page, limit, req }) },
    onLoadTartgetData: (page, limit, record) => { onLoadTargetRent(dispatch, { page, limit, record }) },
    SelectByREQ: (page, limit, req) => { RentToMergeData(dispatch, { page, limit, req }) },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ZyRentList)

