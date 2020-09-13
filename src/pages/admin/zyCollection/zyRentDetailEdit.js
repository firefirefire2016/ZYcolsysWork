import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode } from '../../../utils/ItemUtils';
import { strToTime,timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit } from '../../../store/actions/zyCollectionData';

const items = sysCols.rentCol.filter(item=>item.isInEdit);



function ZyRentDetailEdit(props) {

    const [form] = Form.useForm();

    const { record, isCreating, onEditClick, onCreateClick, page, limit } = props;

    let obj;

    const ResetValue = async () => {
        
         var editables = items.filter(item=>item.editable);

         var values = form.getFieldsValue();

         editables.forEach(ele => {
            values[ele.dataIndex] = 0;
         });
         

         form.setFieldsValue({
            ...values
         })

           
    }

    useEffect(() => {
        console.log('这里是修改账单！！！！！');
        if (isCreating === false) {

            obj = new Object(record);

            
            form.setFieldsValue({
                ...obj
            });
        }
        else {
            message.info('准备创建');
            form.resetFields();
        }

    }, [])

    const onBackHome = () => {
        props.history.push('/admin/zyRentDetailList');
    }

    const onFinish = async values => {
        // onCommitButtonClick();
        try {
            
            let row = form.getFieldValue();

            if (isCreating) {

            } else {

                row.id = obj.id;

                await onEditClick(row, page, limit);

                props.history.push('/admin/zyRentDetailList');
                // 示例：等待5秒后，如果判断成功，则提示

            }

        } catch (error) {
            message.warn(error.message);
        }
    }


    //保存提交
    const onCommitButtonClick = async () => {



    }


    return (
        <Card>
            <Form form={form}
                title="账单编辑"
                name="contractAdd"
                //className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                className='wrap'
            >



                {items.map(item => {
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
                    <Button type="primary" htmlType="submit"
                        //className="login-form-button"
                        className="btn" onClick={onCommitButtonClick}
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
    return state.zyCollectionData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
    return {
        onEditClick: (record, page, limit) => { onCommitEdit(dispatch, { record, page, limit }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZyRentDetailEdit);

