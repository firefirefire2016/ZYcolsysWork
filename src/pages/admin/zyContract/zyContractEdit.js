import React, { useEffect } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode } from '../../../utils/ItemUtils';

const items = sysCols.contractCol;



function ZyContractEdit(props) {

    const [form] = Form.useForm();

    const { record } = props;

    const ResetValue = async () => {
        const currentdata = form.getFieldValue();
        console.log(currentdata);
    }

    useEffect(() => {

        let obj = new Object(record);

        form.setFieldsValue({
            ...obj
        });

    }, [])


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
                    <Button type="primary" htmlType="reset"
                        //className="login-form-button"
                        className="btn" onClick={ResetValue}
                    >
                        重置
                </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

const mapStateToProps = (state) => {
    return state.zyContractData;
}

export default connect(mapStateToProps)(ZyContractEdit);

