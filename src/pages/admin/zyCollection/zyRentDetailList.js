import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../demos/home.scss'
import { onLoadTargetRentList, onEditDetail,onLoadTargetListByREQ} from '../../../store/actions/zyCollectionData';
import { connect } from 'react-redux';
import { parseItemtype, parseTypeToLabel, consoleTarget } from '../../../utils/ItemUtils';

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
              {/* <Button type="primary"
                style={{
                  marginRight: 8,
                }}
                onClick={() => getMoney(record)}
              >
                收租
                </Button>
                <Button type="primary"
                style={{
                  marginRight: 8,
                }}
                onClick={() => returnMoney(record)}
              >
                退租
                </Button> */}
            </span>
          );
        }
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
          //isWarn:consoleTarget(record),
          dataIndex: col.dataIndex,
          title: col.title,
          record
        }
      )
    };
  });

  const { page, total, limit, onLoadData, list, contractid, onEditOne,SelectByREQ } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    message.info('加载中...');

    setTimeout(() => {
      if (isInit) {
        onLoadData(1, -1, contractid,isInit);
        setIsInit(false);
      }
      else {
        onLoadData(1, limit, contractid,isInit);
      }
    }, 100);




    console.log(props);



  }, [])


  const edit = record => {

    //设置要编辑的id
    onEditOne(record);
    props.history.push('/admin/zyRentDetailListEdit');

  };

  const ResetValue = () => {
    form.resetFields();
  }

  /**
   * 筛选
   */
  const onSelectByParams = () => {

    let reqs = form.getFieldsValue();

    let year = reqs['year'];

    let month = reqs['month'];

    let amount_received = reqs['amount_received'];

    let invoice_amount = reqs['invoice_amount'];

    SelectByREQ(year,month,amount_received,invoice_amount,page,limit,contractid,isInit);
  }

  const onChangeSize = (page ,limit ) => {
    let reqs = form.getFieldsValue();

    let year = reqs['year'];

    let month = reqs['month'];

    let amount_received = reqs['amount_received'];

    let invoice_amount = reqs['invoice_amount'];

    SelectByREQ(year,month,amount_received,invoice_amount,page,limit,contractid,isInit);
  }


  return (
    <Card title="账单列表"
      extra={

        <Button type="primary" size="large" onClick={() => {
          props.history.push('/admin/zyRentList');
        }}>
          返回
         </Button>

      }
    >


      <Form
        form={form}
        layout="inline"
        className="components-table-demo-control-bar"
        style={{ marginBottom: 16 }
        }

      >
        <Form.Item
          name="year"
          label='收款年份'
        >
          <Input placeholder="收款年份" type="number"

          />
        </Form.Item>


        <Form.Item
          label='收款月份'
          name="month"
        >
          <Input placeholder="收款月份" type="number"

          />
        </Form.Item>

        <Form.Item
          label='已收款金额>='
          name="amount_received"
          marginRight='20px'
        >
          <Input
            className="site-form-item-icon"
            type="number"
            placeholder="已收款金额"
          />
        </Form.Item>

        <Form.Item
          name="invoice_amount"
          label='开票金额>='
        >
          <Input
            type="number"
            placeholder="开票金额"
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
    onLoadData: (page, limit, contractid,isInit) => { onLoadTargetRentList(dispatch, { page, limit, contractid,isInit }) },
    onEditOne: (record) => { onEditDetail(dispatch, { record }) },
    SelectByREQ:(year,month,amount_received,invoice_amount,page,limit,contractid,isInit) =>
     { onLoadTargetListByREQ(dispatch,{year,month,amount_received,invoice_amount,page,limit,contractid,isInit}) },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ZyRentDetailList)

