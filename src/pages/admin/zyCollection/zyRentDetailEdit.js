import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message, Modal } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { parseItemtype, parseTypeToLabel, parseInputNode, parseRules, consoleTarget,parseLabel } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit, keepFormdata, onBackHome } from '../../../store/actions/zyCollectionAct';
import { getContractList } from '../../../store/actions/zyContractAct';

let items = sysCols.rentCol.filter(item => (item.isInEdit));

const contractCols = sysCols.contractCol.filter(item => (item.isShow && !item.isOper));

const selectItems = sysCols.contractCol.filter(item => item.isSelect);

//const edititems = sysCols.rentCol.filter(item => item.editable);


function ZyRentDetailEdit(props) {

  const [form] = Form.useForm();

  const [contractreqsForm] = Form.useForm();

  const { onEditClick, onCreateClick, loadContractList, onToSelectContract, onBackClick } = props;

  const { record, isCreating, page, limit, id, mode } = props.zyCollectionData;

  const { contractlist, total, selectmode, selectdata } = props.zyContractData;

  const [target, setTarget] = useState({});

  const [conlist, setConList] = useState([]);



  useEffect(() => {

   // console.log('selectdata = ' + JSON.stringify(selectdata));

    let obj;

    let nItems;

    

    switch (mode) {
      case 'home':
        props.history.push('/admin/zyRentDetailList');
        return;
      case 'creating':
        console.log(mode);
       // message.info('准备创建');
        break;

      case 'details':
        // obj = new Object(record);

        // obj.create_itemname = obj.itemname - 2;

        form.setFieldsValue({
          ...record,
          create_itemname : record.itemname - 2
        });
        break;
      case 'editing':
        obj = new Object(record);

        obj.create_itemname = obj.itemname - 2;

        form.setFieldsValue({
          ...obj
        });

        break;
      default:
        break;
    }

    switch (selectmode) {
      case 'backrent':
        obj = new Object(record);

        // nItems = edititems.filter(item => {
        //   return (parseItemtype(item.dataIndex) === 'date')
        // })

        // console.log(nItems);

        // console.log(obj);

        // nItems.forEach((item, index, items) => {
        //   if (obj[item.dataIndex]) {
        //     obj[item.dataIndex] = strToTime(obj[item.dataIndex]);
        //     console.log(strToTime(obj[item.dataIndex]))
        //   }

        // })

        form.setFieldsValue({
          ...obj,
          contractno: selectdata.contractno,
          rentdate: selectdata.rentdate,
          contractid:selectdata.contractid,
        });
        console.log(obj);
        return;
      case 'toselect':
        props.history.push('/admin/zyContract/select');
        break;

      default:
        break;
    }



  }, [mode, selectmode])

  const onBackHome = () => {
    onBackClick();
  }

  const onFinish = async values => {
    try {

      let row = form.getFieldValue();

      switch (mode) {
        case 'creating':
          row['itemname'] = parseInt(row.create_itemname) + 2;

          console.log('row=' + JSON.stringify(row));

          onCreateClick(row, page, limit)
          break;
        case 'editing':
          row.id = id;

          row['itemname'] = parseInt(row.create_itemname) + 2;

          console.log('row=' + JSON.stringify(row));

          onEditClick(row, page, limit)
          break;
        default:
          break;
      }


    } catch (error) {
      message.warn(error.message);
    } finally {



    }
  }

  //编辑
  const selectContract = (record, index) => {



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

    const onSelectByParams = () => {

      let row = contractreqsForm.getFieldValue();
      let { startdate, enddate } = row;


      if (startdate && startdate.indexOf('-') !== -1) {
        row.startdate = startdate.replace(/-/g, "");
      }

      if (enddate && enddate.indexOf('-') !== -1) {
        row.enddate = enddate.replace(/-/g, "");
      }

      let req = { ...row };


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

      loadContractList(page, limit, req);
    }

    const ResetValue = () => {
      contractreqsForm.resetFields();
    }

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        setTarget(selectedRows[0]);

      },
      getCheckboxProps: (record) => ({
      }),
    };

    Modal.confirm({
      title: '选择合同',
      visible: true,
      width: '80%',
      size: 'lager',
      height: '80%',
      // style:{width:'80%',height:'1000px'},       
      content: (
        <Card title='合同列表'>
          <Form
            form={contractreqsForm}
            layout="inline"
            className="components-table-demo-control-bar"
            style={{ marginBottom: 'auto', width: '500' }}
          >
            {selectItems.map(item => {
              return (
                <Form.Item
                  name={item.dataIndex}
                  label={item.title}
                  key={item.dataIndex}
                >
                  {parseInputNode(item, 'screening')}
                </Form.Item>
              )
            })}

            <Form.Item >
              <Button type="primary" onClick={onSelectByParams} >筛选</Button>
              <Button type="primary" htmlType="reset"
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
            columns={mergedColumns(contractCols)}
            dataSource={contractlist}
            size="lager"
            style={{ width: '100%', height: '100%' }}
            pagination={{

              total,
              showSizeChanger: false,
              onChange: (p) => {
                loadContractList(p, limit);
              },
              onShowSizeChange: (current, size) => {
                loadContractList(1, size);
              }
            }
            }
            scroll={{ y: 350 }}
          />

        </Card>
      ),
      onOk() {
        console.log('mode = ' + mode);
      },
      onCancel() { },

      okText: '提交',
      cancelText: '取消'
    });

  }

  const toSelectContract = () => {



    // let formdata = form.getFieldsValue();

    //let _record = new Object(record);

    let formdata = form.getFieldsValue();

    if (record) {
      formdata.id = record.id;
    }


    onToSelectContract(formdata, mode);


  }

  //保存提交
  function onCommitButtonClick() {


  }


  return (
    <Card>
      <Form form={form}
        title="账单编辑"
        name="contractAdd"
        layout="inline"
        onFinish={onFinish}
        className='wrap'
      >



        {items.map(item => {
          return (
            <Form.Item
              name={item.dataIndex}
              label={parseLabel(item,mode)}
              rules={
                parseRules(item)
              }
            >
              {parseInputNode(item, mode)}
            </Form.Item>
          )
        })}
        {/* <Form.Item
              name='收款项目1013'
              label=''
            >
              <Input type='number'  hidden={false}
     style={{ width: '200px' }
  } />;
            </Form.Item> */}

        <Form.Item>
          <Button type="primary" htmlType="submit"
            //className="login-form-button"
            hidden={mode === 'details'}
            className="btn" onClick={onCommitButtonClick}
          >
            保存
                    </Button>
          <Button type="primary" htmlType="reset"
            //className="login-form-button"
            className="btn" onClick={toSelectContract}
            hidden={mode === 'details'}
          >
            选择合同
                    </Button>
          <Button type="primary" htmlType="button"
            //className="login-form-button"
            className="btn"
            onClick={onBackHome}
          >
            关闭
                    </Button >
        </Form.Item>

      </Form>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch, ownprops) => {
  return {
    onBackClick: (page, limit) => { onBackHome(dispatch, { page, limit }) },
    onToSelectContract: (formdata, mode) => { keepFormdata(dispatch, { formdata, mode }) },
    // onLoadData: (page, limit, req) => { onLoadContractData(dispatch, { page, limit, req }) },
    loadContractList: (page, limit, req) => { getContractList(dispatch, { page, limit, req }) },
    onEditClick: (record) => { onCommitEdit(dispatch, { record }) },
    onCreateClick: (record) => { onCommitCreate(dispatch, { record }) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZyRentDetailEdit);

