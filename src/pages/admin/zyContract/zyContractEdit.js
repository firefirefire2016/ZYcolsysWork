import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message, Layout } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode, parseRules, consoleTarget } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit } from '../../../store/actions/zyContractData';
import { onLoadTargetListByREQ } from '../../../store/actions/zyPropertyAct';
import { PlusOutlined } from '@ant-design/icons';

const items = sysCols.contractCol;

const cols = sysCols.rentlistCol.filter(item => item.isInEdit);

const { Header, Content, Sider } = Layout;

function ZyContractEdit(props) {

    const [form] = Form.useForm();

    const { rightnos } = props.zyPropertyData;

    const { record, isCreating, page, limit } = props.zyContractData;

    const { onEditClick, onCreateClick, loadPropertyList } = props;

    const { list } = props.zyRentlistData;



    let obj;

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
                  //  onClick={() => edit(record)}
                  >
                    编辑
                    </Button>   
    
    
    
                  <Popconfirm
                    title='确定删除?'
                    onConfirm={() => {
                     // onConfirmDel(record.id, -1, page, limit)
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

    const ResetValue = async () => {
        form.resetFields();

        // let testdate = new Date('2020-02-28');

        // testdate.setDate(testdate.getDate() + 1);

         console.log(props) ;

        // testdate.getDate()

    }

    useEffect(() => {

        loadPropertyList(1,-1);

        if (isCreating === false) {

            obj = new Object(record);

            let nItems = items.filter(item => {
                return (parseItemtype(item.dataIndex) === 'date')
            })

            nItems.forEach((item, index, items) => {
                if (obj[item.dataIndex]) {
                    obj[item.dataIndex] = strToTime(obj[item.dataIndex]);
                }

            })


            form.setFieldsValue({
                ...obj
            });
        }
        else {
            message.info('准备创建');
            form.resetFields();
        }

        console.log(props);

    }, [])

    const onBackHome = () => {
        props.history.push('/admin/zyContract');
    }

    const onFinish = async values => {
        try {

            let row = form.getFieldValue();

            var res = 0;

            console.log(row);


            let nItems = items.filter(item => {
                return (parseItemtype(item.dataIndex) === 'date')
            })


            nItems.forEach((item, index, items) => {
                row[item.dataIndex] = timeToStr(row[item.dataIndex]);

            })


            if (isCreating) {


                await onCreateClick(row, page, limit);

                props.history.push('/admin/zyContract');

            } else {
                row.id = obj.id;

                //console.log(row);

                await onEditClick(row, page, limit);

                props.history.push('/admin/zyContract');
                // 示例：等待5秒后，如果判断成功，则提示

            }

        } catch (error) {
            message.warn(error.message);
        }
    }

    const editContract = async () => {

    }

    //保存提交
    const onCommitButtonClick = async () => {



    }

    const getPlus = (item) => {

    }


    return (
        <Card>
            <Form form={form}
                title="合同编辑表单"
                name="contractAdd"
                //className="login-form"
                layout="inline"
                // initialValues={{
                //     remember: true,
                // }}

                onFinish={onFinish}
                className='wrap'
            >



                {items.filter(item => item.editable).map(item => {
                    return (
                        <Form.Item
                            name={item.dataIndex}
                            label={item.title}
                            style={{ margin: 'auto' }}
                            rules={
                                parseRules(item)
                            }
                        >
                            {parseInputNode(item)}
                        </Form.Item>
                    )
                })}

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

                        //   total,
                        showSizeChanger: true,
                        onChange: (p) => {
                            //       onLoadData(p, limit);
                        },
                        onShowSizeChange: (current, size) => {
                            //       onLoadData(1, size);
                        }
                    }
                    }
                    // scroll={{ x: 'calc(700px + 50%)', y: 350 }}
                    scroll={{ y: 350 }}
                />

                <Form.Item>
                    <Button type="primary" htmlType="submit"
                        //className="login-form-button"
                        className="btn" onClick={editContract}
                    >
                        提交
                    </Button>
                    <Button type="primary" htmlType="reset"
                        //className="login-form-button"
                        className="btn" onClick={ResetValue}
                    >
                        重置
                    </Button>
                    <Button type="primary" htmlType="button"
                        //className="login-form-button"
                        className="btn"
                        onClick={onBackHome}
                    >
                        返回
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
        loadPropertyList: (page, limit, req,) => { onLoadTargetListByREQ(dispatch, { page, limit, req }) },
        onEditClick: (record, page, limit) => { onCommitEdit(dispatch, { record, page, limit }) },
        onCreateClick: (record, page, limit) => { onCommitCreate(dispatch, { record, page, limit }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZyContractEdit);

