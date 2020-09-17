import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode,parseRules, consoleTarget } from '../../../utils/ItemUtils';
import { strToTime,timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit } from '../../../store/actions/zyContractData';
import {  PlusOutlined } from '@ant-design/icons';

const items = sysCols.contractCol;



function ZyContractEdit(props) {

    const [form] = Form.useForm();

    const { record, isCreating, onEditClick, onCreateClick, page, limit } = props;

    let obj;

    const ResetValue = async () => {
        form.resetFields();

        // let testdate = new Date('2020-02-28');

        // testdate.setDate(testdate.getDate() + 1);

        // console.log(testdate.toLocaleString()) ;

       // testdate.getDate()

    }

    useEffect(() => {
        if (isCreating === false) {

            obj = new Object(record);

            let nItems = items.filter(item=>{
                return (parseItemtype(item.dataIndex) === 'date')})
             
             nItems.forEach((item, index, items) => {
                 if(obj[item.dataIndex]){
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


            let nItems = items.filter(item=>{
               return (parseItemtype(item.dataIndex) === 'date')})

            //console.log('什么情况' + nItems);
            
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

    const getPlus = (item) =>{
        if(item.dataIndex === 'rightno'){
            return(
                <PlusOutlined
                    
                    className="dynamic-delete-button"
                    style={{ margin: '0 8px' }}
                    onClick={() => {
                    }}
                  />
                  
                  )
        }       
            
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
                            style={{margin:'auto'}}
                            rules={
                                parseRules(item)
                            }
                        >
                            {parseInputNode(item)}
                        </Form.Item>
                    )
                })}

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
    return state.zyContractData;
}

const mapDispatchToProps = (dispatch, ownprops) => {
    return {
        onEditClick: (record, page, limit) => { onCommitEdit(dispatch, { record, page, limit }) },
        onCreateClick: (record, page, limit) => { onCommitCreate(dispatch, { record, page, limit }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZyContractEdit);

