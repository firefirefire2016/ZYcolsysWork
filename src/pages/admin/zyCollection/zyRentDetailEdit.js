import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode, parseRules, consoleTarget } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit } from '../../../store/actions/zyCollectionData';
import { onLoadContractData } from '../../../store/actions/zyContractData';

const items = sysCols.rentCol.filter(item => item.isInEdit);

const select_contracts = ['测试1', '测试2'];


function ZyRentDetailEdit(props) {

    const [form] = Form.useForm();

    const [selects, setSelects] = useState(select_contracts);

    const { onEditClick, onCreateClick, loadContractList } = props;

    const { record, isCreating, page, limit, id } = props.zyCollectionData;

    const { list,newSelects } = props.zyContractData;

    let obj;

    const ResetValue = async () => {

        //  var editables = items.filter(item=>item.editable);

        //  var values = form.getFieldsValue();

        //  editables.forEach(ele => {
        //     values[ele.dataIndex] = 0;
        //  });

        //consoleTarget(props.zyContractData);

        form.resetFields();

        //consoleTarget(list);

        

        //  form.setFieldsValue({
        //     ...values
        //  })


    }

    useEffect(() => {
     //   console.log('list = ' + list);

        loadContractList(1, -1);

        setTimeout(() => {
            
        }, 1000);



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

            console.log('isCreating = ' + isCreating);

            if (isCreating) {
                onCreateClick(row, page, limit, props);



            } else {

                row.id = obj.id;

                let res = await onEditClick(row, page, limit);

                console.log('res = ' + JSON.stringify(res));

                if (res.code === 0) {
                    message.info(res.msg);
                    props.history.push('/admin/zyRentDetailList');
                }
                else {
                    message.warn('修改提交失败');
                }

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
                layout="inline"
                onFinish={onFinish}
                className='wrap'
            >



                {items.map(item => {
                    return (
                        <Form.Item
                            name={item.dataIndex}
                            label={item.title}
                            rules={
                                parseRules(item)
                            }
                        >
                            {parseInputNode(item, newSelects)}
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
    return state;
}

const mapDispatchToProps = (dispatch, ownprops) => {
    return {
        loadContractList: (page, limit, req,) => { onLoadContractData(dispatch, { page, limit, req}) },
        onEditClick: (record, page, limit) => { onCommitEdit(dispatch, { record, page, limit }) },
        onCreateClick: (record, page, limit, props) => { onCommitCreate(dispatch, { record, page, limit }, props) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZyRentDetailEdit);

