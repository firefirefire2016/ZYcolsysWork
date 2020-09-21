import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode, parseRules, consoleTarget } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit } from '../../../store/actions/zyCollectionData';
import { onLoadContractData } from '../../../store/actions/zyContractData';

const items = sysCols.rentCol.filter(item => item.isInEdit);



function ZyRentDetailEdit(props) {

    const [form] = Form.useForm();

    //const [code,setCode] = useState(1);

    const { onEditClick, onCreateClick, loadContractList } = props;

    const { record, isCreating, page, limit, id, res,mode } = props.zyCollectionData;

    const { list, newSelects } = props.zyContractData;

    let obj;

    const ResetValue = async () => {
        console.log('res' + JSON.stringify(res));
        //form.resetFields();

    }

    useEffect(() => {

        loadContractList(1, -1);

        if (res) {
            if (res.code === 0) {
                props.history.push('/admin/zyRentDetailList');
            }
        }

        if (isCreating === false) {

            obj = new Object(record);

            if (newSelects) {
                for (let index = 0; index < newSelects.length; index++) {
                    const element = newSelects[index];

                    if (element === obj['contractno']) {
                        obj.select_contractno = index;
                        break;
                    }

                }
            }

            obj.create_itemname = obj.itemname - 2;

            form.setFieldsValue({
                ...obj
            });
        }
        else {
            message.info('准备创建');
            form.resetFields();
        }


    }, [res])

    const onBackHome = () => {
        props.history.push('/admin/zyRentDetailList');
    }

    const onFinish = async values => {
        try {

            let row = form.getFieldValue();

            if (isCreating) {

                row['contractno'] = newSelects[row.select_contractno];

                row['itemname'] = parseInt(row.create_itemname) + 2;

                console.log('row=' + JSON.stringify(row));

                onCreateClick(row, page, limit)


            } else {

                row.id = id;

                row['contractno'] = newSelects[row.select_contractno];

                row['itemname'] = parseInt(row.create_itemname) + 2;

                console.log('row=' + JSON.stringify(row));

                onEditClick(row, page, limit)
            }

        } catch (error) {
            message.warn(error.message);
        } finally {



        }
    }


    //保存提交
    function onCommitButtonClick() {

        // if(res.code === 0){
        //     props.history.push('/admin/zyRentDetailList');
        // }
        // else{
        //     console.log('一直执行么');
        // }
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
                            {parseInputNode(item,mode, newSelects)}
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
        loadContractList: (page, limit, req,) => { onLoadContractData(dispatch, { page, limit, req }) },
        onEditClick: (record) => { onCommitEdit(dispatch, { record }) },
        onCreateClick: (record) => { onCommitCreate(dispatch, { record }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZyRentDetailEdit);

