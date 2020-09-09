import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode } from '../../../utils/ItemUtils';
import { onCommitCreate, onCommitEdit } from '../../../store/actions/zyContractData';

const items = sysCols.contractCol;



function ZyContractEdit(props) {

    const [form] = Form.useForm();

    const { record, isCreating, onEditClick, onCreateClick } = props;

    let obj;

    const ResetValue = async () => {
        form.resetFields();
    }

    useEffect(() => {
        console.log('isCreating == ' + isCreating);
        console.log(props);
        if (isCreating === false) {

            obj = new Object(record);

            form.setFieldsValue({
                ...obj
            });
        }
        else {
            form.resetFields();
        }

    }, [])

    const onBackHome = () => {
        props.history.push('/admin/zyContract');
    }


    //保存提交
    const onCommitButtonClick = async () => {
        try {
            let row = form.getFieldValue();

            var res = 0;

            if (isCreating) {


                await onCreateClick(row);

                props.history.push('/admin/zyContract');

            } else {
                row.id = obj.id;
                await onEditClick(row);
                
                //console.log(props.res);

                props.history.push('/admin/zyContract');
                // 示例：等待5秒后，如果判断成功，则提示

            }

        } catch (error) {
            message.warn(error.message);
        }


    }


    return (
        <Card>
            <Form form={form}
                title="合同编辑表单"
                name="contractAdd"
                //className="login-form"
                initialValues={{
                    remember: true,
                }}
                //onFinish={onFinish}
                className='wrap'
            >



                {items.filter(item => item.isShow).map(item => {
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
    return state.zyContractData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
    return {
        onEditClick: (record) => { onCommitEdit(dispatch, { record }) },
        onCreateClick: (record) => { onCommitCreate(dispatch, { record }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZyContractEdit);

