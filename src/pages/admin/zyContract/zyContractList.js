import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, InputNumber } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import '../../home.scss'
import { onLoadContractData,onGetEditData } from '../../../store/actions/zyContractData';
import { increaseAction } from '../../../store/actions/zyCounter';
import { connect } from 'react-redux';
import { selectItems,parseItemtype,parseTypeToLabel, parseInputNode} from '../../../utils/ItemUtils';
import Modal from 'antd/lib/modal/Modal';

const cols = sysCols.contractCol;

const renttypes = selectItems.renttypes;

const { Option } = Select;

const useResetFormOnCloseModal = ({ form, visible,record}) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;
  useEffect(() => {
    console.log(record);
    if (!visible && prevVisible) {
      form.resetFields();
    }
    form.setFieldsValue({
            ...record
        });
  }, [visible]);
};

const ModalForm = (props) => {

  const [form] = Form.useForm();

  //let record = {contractno:'nihao'};



  // useResetFormOnCloseModal({
    
  //   form,
  //   visible,
  //   record
  // });  

  useEffect(() => {

    console.log(props);
  }, [])

  const onOk = () => {
   // form.submit();

    const currentdata = form.getFieldValue();

        console.log(currentdata);
  };

  const ResetValue = async () => {
    form.resetFields();

  }

  const onCancel = async()=>{
    console.log(props);
  }

  return (
    <Modal title="合同编辑"  onOk={onOk} visible={props.visible} onCancel={onCancel}>
      <Form form={form} layout="vertical" name="userForm">
        {cols.filter(item => item.isShow).map(item => {
                    return (
                        <Form.Item
                            name={item.dataIndex}
                            label={item.title}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入' + item.title,
                                },
                            ]}
                        >
                            {parseInputNode(item)}
                        </Form.Item>
                    )
                })}
                <Form.Item>
                <Button type="primary" htmlType="reset"
                    //className="login-form-button"
                    className="btn" onClick={ResetValue}
                >
                    重置
                </Button>
                </Form.Item>
      </Form>
    </Modal>
  );
};

const  ZyContractList =(props)=> {

  const [visible, setVisible] = useState(false);

  console.log(props);

  const EditableCell = ({
    labelType,
    children,
    record,
    isWarn,
    ...restProps
  }) => {

    return (
      <td {...restProps} type='primary' className=''>

          {parseTypeToLabel(record,labelType,children)}
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
                onClick={()=>edit(record)}
                >
                编辑
                </Button>
              <Popconfirm
                title='确定删除么?'
              >
                <Button type="primary"
                  style={{
                    marginRight: 8,
                  }}>
                  删 除
                </Button>
              </Popconfirm>

              <Popconfirm
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

            </span>
          );
        }
      }


      return col;
    }

    return {
      ...col,
      onCell: (record,rowIndex) => (
            
        {
            //record,
            labelType:parseItemtype(col.dataIndex),
            rowIndex,
            isWarn: record.isWarn?true:false,
            dataIndex: col.dataIndex,
            title: col.title,
            record
          }
          )
    };
  });

  const { list, page, total, limit,  onLoadData,onEditClick} = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    onLoadData(page, limit);
  }, [])

  const onCreateClick = ()=>{
    props.history.push('/admin/zyContract/createOne');
  }

  // const onEditClick = (record)=>{
  //   props.history.push('/admin/zyContract/edit');
  // }

  const hideUserModal = () => {
    setVisible(false);
  };

  const edit = record => {

    //设置要编辑的id
    onEditClick(record);
    props.history.push('/admin/zyContract/edit');


  };

  return (
    <Card title="合同列表"
      extra={

        <Button type="primary" size="large" onClick={onCreateClick}>
          新增合同
           </Button>

      }>


      <Form
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

          rules={[
            {
              message: '请选择招租方式',
            }]}
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
          <Button type="primary">筛选</Button>
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
            onLoadData(current, size);
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
    onLoadData: (page, limit) => { onLoadContractData(dispatch, { page, limit }) },
    onIncreaseClick: () => { increaseAction(dispatch, ownprops) },
    onEditClick:(record)=>{ onGetEditData(dispatch,{record})},
  }
}

//connect(mapStateToProps)(ModalForm)

export default connect(mapStateToProps, mapDispatchToProps)(ZyContractList)

