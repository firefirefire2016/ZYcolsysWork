import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode, parseRules, consoleTarget } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit } from '../../../store/actions/zyPropertyAct';

const items = sysCols.propertyCol.filter(item => item.isInEdit);



function PropertyRightEdit(props) {

    const [form] = Form.useForm();

    const { onEditClick, onCreateClick } = props;

    const { record, isCreating, page, limit, id, res,mode } = props;


    let obj;

    const ResetValue = async () => {
        //console.log('res' + JSON.stringify(res));
        form.resetFields();

    }

    useEffect(() => {

        //console.log('isCreating!!! === ' + isCreating);

        if (res) {
            if (res.code === 0) {
                props.history.push('/admin/propertyRight');
            }
        }

        if (isCreating === false) {

            obj = new Object(record);


            //obj.create_itemname = obj.itemname - 2;

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
        props.history.push('/admin/propertyRight');
    }

    const onFinish = async values => {
        try {

            let row = form.getFieldValue();

            if (isCreating) {

        //        console.log('row:' + JSON.stringify(row));


                onCreateClick(row)


            } else {

                row.id = id;

                
                console.log('row:' + JSON.stringify(row));

                onEditClick(row,'COMMIT_Edit')
            }

        } catch (error) {
            message.warn(error.message);
        } finally {



        }
    }


    //保存提交
    function onCommitButtonClick() {

    }


    return (
        <Card>
            <Form form={form}
                title="产权编辑"
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
                            {parseInputNode(item,mode)}
                        </Form.Item>
                    )
                })}

                <Form.Item>
                    <Button type="primary" htmlType="submit"
                        //className="login-form-button"
                        className="btn" onClick={onCommitButtonClick}
                        hidden={mode==='details'}
                    >
                        提交
                    </Button>
                    <Button type="primary" htmlType="reset"
                        //className="login-form-button"
                        className="btn" onClick={ResetValue}
                        hidden={mode==='details'}
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
    return state.zyPropertyData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
    return {
       // loadTargetList: (page, limit, req,) => { onLoadPropertyData(dispatch, { page, limit, req }) },
        onEditClick: (record) => { onCommitEdit(dispatch, { record }) },
        onCreateClick: (record) => { onCommitCreate(dispatch, { record }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyRightEdit);

