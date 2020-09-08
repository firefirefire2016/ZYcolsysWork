import React, { useEffect } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { selectItems,parseItemtype,parseTypeToLabel,parseInputNode} from '../../../utils/ItemUtils';

const items = sysCols.contractCol;

function ZyContractEdit() {
    return (
        <div>
            <Form
                title="合同编辑表单"
                name="contractAdd"
                //className="login-form"
                initialValues={{
                    remember: true,
                }}
                //onFinish={onFinish}
                className='wrap'
            >
                {items.filter(item=>item.isShow).map(item => {
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
            </Form>
        </div>
    )
}

export default ZyContractEdit

