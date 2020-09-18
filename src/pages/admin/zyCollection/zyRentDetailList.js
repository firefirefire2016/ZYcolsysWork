import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../demos/home.scss'
import { onEditDetail, onLoadTargetListByREQ,onCreateData } from '../../../store/actions/zyCollectionData';
import { connect } from 'react-redux';
import { parseItemtype, parseTypeToLabel, consoleTarget, parseInputNode } from '../../../utils/ItemUtils';

const selectItems = sysCols.rentCol.filter(item => item.isSelect);

const cols = sysCols.rentCol.filter(item => item.isShow);

//const renttypes = selectItems.renttypes;

const { Option } = Select;


const ZyRentDetailList = (props) => {

  //console.log(props);
  const [form] = Form.useForm();

  const [isInit, setIsInit] = useState(true);

  const EditableCell = ({
    labelType,
    children,
    dataIndex,
    record,
    isWarn,
    ...restProps
  }) => {


    return (
      // eslint-disable-next-line react/jsx-no-duplicate-props
      <td {...restProps} type='primary' className='' className={(isWarn) ? 'warn' : ''}>

        {parseTypeToLabel(record, dataIndex, children)}
      </td>
    );
  };

  const mergedColumns = cols => cols.map(col => {
    if (!col.editable) {
      if (col.isOper === true) {
        col.render = (text, record, index) => {
          switch (record.itemname) {
            case 1://合同租金
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
            case 2://押金
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
              )
            case 3://管理费
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
              )
            case 4://其他
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
              )
            default:
              break;
          }
          // return (
          //   <span className=''>
          //     <Button type="primary"
          //       style={{
          //         marginRight: 8,
          //       }}
          //       onClick={() => edit(record)}
          //     >
          //       编辑
          //       </Button>
          //   </span>
          // );
        }
      }



    }

    return {
      ...col,
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

  const { page, total, limit, list, contractid, contractno, overstate, onEditOne, SelectByREQ,onCreate } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    message.info('加载中...');

    setTimeout(() => {
      if (isInit) {
        //onLoadData(1, -1, contractid,isInit);
        SelectByREQ(1, -1, { contractid, isInit });
        setIsInit(false);
      }
      else {
        //从本期账单过来的话
        form.setFieldsValue({
          contractno,
          overstate
        })
        SelectByREQ(1, limit, { contractid, isInit, contractno, overstate });
        //onLoadData(1, limit, contractid,isInit);
      }
    }, 100);

  }, [])

  //收款
  const getRent = record => {

  }

  //开票
  const getInvoice = record => {

  }

  //详情
  const loadDetail = record => {

  }

  //编辑
  const edit = record => {

    //设置要编辑的id
    onEditOne(record);
    props.history.push('/admin/zyRentDetailList/edit');

  };

  //删除
  const del = record => {

  }

  const ResetValue = () => {
    form.resetFields();
  }

  /**
   * 筛选
   */
  const onSelectByParams = () => {

    let reqs = form.getFieldsValue();

    reqs.contractno = contractno;

    SelectByREQ(page, limit, reqs);
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
        <Button type="primary" size="large" onClick={() => {
          props.history.push('/admin/zyRentList');
        }}>
          本期账单
         </Button>
         <Button type="primary" size="large" onClick={() => {
           //设置要编辑的id
           onCreate(true);
          props.history.push('/admin/zyRentDetail/edit');
        }}>
          新增
         </Button>
         </Form.Item>
      }
    >


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
              rules={[
                {
                  required: true,
                  message: item.title,
                },
              ]}
            >
              {parseInputNode(item)}
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
            //console.log('contractid = ' + contractid);

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
    </Card>
  )
}

const mapStateToProps = (state) => {
  return state.zyCollectionData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
  return {
    onCreate:(isCreating) => {onCreateData(dispatch,isCreating)},
    //onLoadData: (page, limit, contractid,isInit) => { onLoadTargetRentList(dispatch, { page, limit, contractid,isInit }) },
    onEditOne: (record) => { onEditDetail(dispatch, { record }) },
    SelectByREQ: (page, limit, req) => { onLoadTargetListByREQ(dispatch, { page, limit, req }) },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ZyRentDetailList)

