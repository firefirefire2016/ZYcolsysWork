import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message, Modal } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode, parseRules, consoleTarget } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit } from '../../../store/actions/zyCollectionAct';
import { onLoadContractData } from '../../../store/actions/zyContractAct';

const items = sysCols.rentCol.filter(item => item.isInEdit);



function ZyRentDetailEdit(props) {

    const [form] = Form.useForm();

    const { onEditClick, onCreateClick, loadContractList } = props;

    const { record, isCreating, page, limit, id, res, mode } = props.zyCollectionData;

    const { list, newSelects } = props.zyContractData;

    let obj;

    // const ResetValue = async () => {
    //     console.log('res' + JSON.stringify(res));
    //     //form.resetFields();

    // }

    useEffect(() => {

       // loadContractList(1, -1);

        switch (mode) {
            case 'home':
                props.history.push('/admin/zyRentDetailList');
                break;
            case 'creating':
                console.log(mode);
                message.info('准备创建');
                form.resetFields();
                break;
            case 'editing':
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

                break;
            default:
                break;
        }



    }, [mode])

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

    //编辑
    const selectContract = (record, index) => {

        // Modal.confirm({
        //     title: '租金标准',
        //     visible: true,

        //     content: (
        //         <Form form={modalForm} layout="vertical" name="userForm"
        //             initialValues={{
        //                 ...record
        //             }}
        //             onFinish={values => {
        //             }}
        //         >
        //             {edititems.filter(item => item.isInEdit).map(item => {
        //                 return (
        //                     <Form.Item
        //                         name={item.dataIndex}
        //                         label={item.title}
        //                         style={{ margin: 'auto' }}
        //                         rules={
        //                             parseRules(item)
        //                         }
        //                     >
        //                         {parseInputNode(item, mode)}
        //                     </Form.Item>
        //                 )
        //             })}

        //         </Form>
        //     ),
        //     onOk() {
        //         let values = modalForm.getFieldsValue();

        //         let newData = new Object(tabledata);

        //         newData[index] = { id: newData[index].id, ...values };

        //         setTableData([...newData]);

        //         // console.log(tabledata);
        //     },
        //     onCancel() { },

        //     okText: '提交',
        //     cancelText: '取消'
        // });

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
                            label={item.title}
                            rules={
                                parseRules(item)
                            }
                        >
                            {parseInputNode(item, mode, newSelects)}
                        </Form.Item>
                    )
                })}

                <Form.Item>
                    <Button type="primary" htmlType="submit"
                        //className="login-form-button"
                        className="btn" onClick={onCommitButtonClick}
                    >
                        保存
                    </Button>
                    <Button type="primary" htmlType="reset"
                        //className="login-form-button"
                        className="btn" onClick={selectContract}
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
        loadContractList: (page, limit, req,) => { onLoadContractData(dispatch, { page, limit, req }) },
        onEditClick: (record) => { onCommitEdit(dispatch, { record }) },
        onCreateClick: (record) => { onCommitCreate(dispatch, { record }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZyRentDetailEdit);

