import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message, Layout, Modal, InputNumber, Spin } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode, parseRules, consoleTarget, getSelectNode } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit, onBackHome, keepFormdata } from '../../../store/actions/zyContractAct';
import { onLoadTargetListByREQ } from '../../../store/actions/zyPropertyAct';
import { PlusOutlined } from '@ant-design/icons';

const items = sysCols.contractCol;

const cols = sysCols.rentlistCol.filter(item => item.isInEdit);

const edititems = sysCols.rentlistCol.filter(item => item.editable);

const { Header, Content, Sider } = Layout;

const { Option } = Select;


function ZyContractEdit(props) {

    const [form] = Form.useForm();

    const [modalForm] = Form.useForm();

    const [addForm] = Form.useForm();

    const [count, setCount] = useState(1);

    const { rightno, selectmode } = props.zyPropertyData;

    const { record, page, limit, mode, rentlist, _tabledata } = props.zyContractData;

    const { onEditClick, onCreateClick, onToSelectRight, onBackClick } = props;

    const [tabledata, setTableData] = useState([]);

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
                                onClick={() => edit(record, index)}
                                hidden={mode === 'details'}
                            >
                                编辑
                    </Button>



                            <Popconfirm
                                title='确定删除?'
                                onConfirm={() => {
                                    handleDelete(record)
                                }}
                                hidden={mode === 'details'}
                            >
                                <Button type="primary"
                                    hidden={mode === 'details'}
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

    //编辑
    const edit = (record, index) => {

        // let row = form.getFieldValue();


        let nItems = edititems.filter(item => {
            return (parseItemtype(item.dataIndex) === 'date')
        })

        nItems.forEach((item, index, items) => {

            if (record[item.dataIndex]) {
                record[item.dataIndex] = strToTime(record[item.dataIndex]);
            }

        })

        Modal.confirm({
            title: '租金标准',
            visible: true,

            content: (
                <Form form={modalForm} layout="vertical" name="userForm"
                    initialValues={{
                        ...record
                    }}
                    onFinish={values => {
                        //console.log('这里啊');
                        // let newData = { rowIndex: count, id: count, ...values };

                        // setTableData([...tabledata, newData]);

                        // setCount(count + 1);

                        let newData = new Object(tabledata);

                        newData[index] = { id: newData[index].id, ...values };

                        setTableData([...newData]);
                    }}
                >
                    {edititems.filter(item => item.isInEdit).map(item => {
                        return (
                            <Form.Item
                                name={item.dataIndex}
                                label={item.title}
                                style={{ margin: 'auto' }}
                                rules={
                                    parseRules(item)
                                }
                            >
                                {parseInputNode(item, mode)}
                            </Form.Item>
                        )
                    })}

                </Form>
            ),
            onOk() {



                // let values = modalForm.getFieldsValue();

                // let newData = new Object(tabledata);

                // newData[index] = { id: newData[index].id, ...values };

                // setTableData([...newData]);

                try {
                    //const values = modalForm.validateFields();
                    // let values = addForm.getFieldsValue();
                    modalForm.submit();

                    // console.log('res = ' + res);
                    // if(values){
                    //     let newData = { rowIndex: count, id: count, ...values };

                    //     setTableData([...tabledata, newData]);

                    //     setCount(count + 1);
                    // }

                } catch (errorInfo) {
                }

                // console.log(tabledata);
            },
            onCancel() { },

            okText: '提交',
            cancelText: '取消'
        });

    }

    const handleDelete = (record) => {
        // const dataSource = [...this.state.dataSource];
        // this.setState({
        //   dataSource: dataSource.filter((item) => item.key !== key),
        // });

        setTableData(tabledata.filter(item => item.id !== record.id));
    };

    const ResetValue = async () => {

    }

    const loadValue = () => {



        // let formdata = form.getFieldsValue();

        //let _record = new Object(record);

        let formdata = form.getFieldsValue();



        if (record) {
            formdata.id = record.id;
        }

        // if(record && record.rightid !== undefined && formdata.rightid === undefined){
        //     formdata.rightid = record.rightid;
        // }

        if (rightno && rightno.id !== undefined) {
            formdata.rightid = rightno.id;
        }

        let _rightno = rightno;

        

        if (mode === 'editing' && record.zypropertyright) {
            let obj = new Object(record);
            _rightno = obj.zypropertyright;
        }

        onToSelectRight(formdata, tabledata, mode, _rightno);







    }

    useEffect(() => {

        //console.log(' mode = ' + mode);

        console.log(props);


        if (rentlist) {
            setTableData(rentlist);
        }

       // console.log(' tabledata = ' + JSON.stringify(tabledata));

        let obj;

        let nItems;


        switch (mode) {
            case 'home':

                props.history.push('/admin/zyContract');

                break;
            case 'details':

                obj = new Object(record);


                nItems = edititems.filter(item => {
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
                break;
            case 'editing':
                obj = new Object(record);

                nItems = edititems.filter(item => {
                    return (parseItemtype(item.dataIndex) === 'date')
                })

                nItems.forEach((item, index, items) => {
                    if (obj[item.dataIndex]) {
                        obj[item.dataIndex] = strToTime(obj[item.dataIndex]);
                    }

                })

                // console.log(obj);

                // console.log(rightnos);

                form.setFieldsValue({
                    ...obj,
                    // ...rightnos,//注意：rightno的id会覆盖obj的id
                });

                // console.log(JSON.stringify(_tabledata));
                if (_tabledata != null) {
                    setTableData(_tabledata);
                }


                break;
            case 'keepon':
                obj = new Object(record);

                nItems = edititems.filter(item => {
                    return (parseItemtype(item.dataIndex) === 'date')
                })

                nItems.forEach((item, index, items) => {
                    delete obj[item.dataIndex];
                })

                delete obj.contractno;

                delete obj.id;

                form.setFieldsValue({
                    ...obj,
                    //   ...rightnos,
                });

                console.log(JSON.stringify(_tabledata));
                if (_tabledata != null) {
                    setTableData(_tabledata);
                }
                break;
            case 'creating':
                form.resetFields();

                form.setFieldsValue({
                    rentdate: 5
                });

                break;
            default:
                break;
        }

        switch (selectmode) {
            case 'backcontract':
                obj = new Object(record);

                nItems = edititems.filter(item => {
                    return (parseItemtype(item.dataIndex) === 'date')
                })

                nItems.forEach((item, index, items) => {
                    if (obj[item.dataIndex]) {
                        obj[item.dataIndex] = strToTime(obj[item.dataIndex]);
                    }

                })

                form.setFieldsValue({
                    ...obj,
                    ...rightno,
                });

                if (_tabledata != null) {
                    setTableData(_tabledata);
                }
                return;
            case 'toselect':
                props.history.push('/admin/propertyRight/select');
                break;

            default:
                break;
        }





    }, [mode, selectmode])

    const onBackHome = () => {
        // console.log(' tabledata = ' + JSON.stringify(tabledata) );
        onBackClick();
        //props.history.push('/admin/zyContract');
    }

    const onTest = () => {
        let row = form.getFieldValue();
        console.log(' tabledata = ' + JSON.stringify(tabledata));
        console.log(row);

        console.log(rightno);
        // onBackClick();
        //props.history.push('/admin/zyContract');
    }

    //弹出产权表，进行绑定
    const rightModal = record => {

        // Modal.confirm({
        //   title: '产权表',
        //   visible: true,

        //   content: (
        //     <Form form={rightForm} layout="vertical" name="userForm"
        //       initialValues={{
        //       }}
        //       onFinish={values => {
        //       }}
        //     >
        //       <Form.Item
        //         name="quitdate"
        //         label="退租日期"
        //         rules={[
        //           {
        //             required: true,
        //           },
        //         ]}
        //       >
        //         <Input type={'date'} style={{ width: '200px' }} />
        //       </Form.Item>
        //     </Form>
        //   ),
        //   onOk() {
        //     let values = refundForm.getFieldsValue();
        //     record.quitdate = timeToStr(values.quitdate);
        //     let date = new Date();
        //     let year = date.getFullYear();
        //     let month = date.getMonth();
        //     let day = date.getDate();
        //     if(month < 10){
        //       month = '0' + month;
        //     }
        //     if(day < 10){
        //       day = '0' + day;
        //     }
        //     let stopdate = year + month + day;
        //     record.stopdate = stopdate;
        //     record.stopreason = '退租';
        //     record.contract_status = 4;
        //     onStatusClick(record,'COMMIT_REFUND');
        //   },
        //   onCancel() { },

        //   okText: '提交',
        //   cancelText: '取消'
        // });

    }

    const onFinish = values => {
        try {

            let row = form.getFieldValue();


            // let nItems = edititems.filter(item => {
            //     return (parseItemtype(item.dataIndex) === 'date')
            // })

            // nItems.forEach((item, index, items) => {
            //     row[item.dataIndex] = timeToStr(row[item.dataIndex]);

            // })

            if (rightno) {
                row['rightid'] = rightno.id;
            }


            if (!row.rightid) {
                message.warn('必须绑定一个产权');
                return;
            }

            switch (mode) {
                case 'creating':

                    //创建合同同时，创建租金标准
                    onCreateClick(row, page, limit, tabledata);
                    break;
                case 'keepon':


                    //续租创建合同同时，创建租金标准
                    onCreateClick(row, page, limit, tabledata);

                    break;
                case 'editing':


                    let _record = new Object(record);

                    row['id'] = _record.id;


                    onEditClick(row, page, limit, tabledata);

                    break;

                default:
                    break;
            }

        } catch (error) {
            console.log(error.message);
            message.warn(error.message);
        }
    }


    //保存提交
    const onCommitButtonClick = async () => {
    }


    const handleAdd = () => {
        addForm.resetFields();
        Modal.confirm({
            title: '新增租金标准',
            visible: true,

            content: (
                <Form form={addForm} layout="vertical" name="userForm"
                    initialValues={{
                    }}

                    onFinish={values => {
                        // console.log('hey!');

                        let newData = { rowIndex: count, id: count, ...values };

                        setTableData([...tabledata, newData]);

                        setCount(count + 1);
                    }}
                >
                    {edititems.filter(item => item.isInEdit).map(item => {
                        return (
                            <Form.Item
                                key={item.dataIndex}
                                name={item.dataIndex}
                                label={item.title}
                                style={{ margin: 'auto' }}
                                rules={
                                    parseRules(item)
                                }
                            >
                                {parseInputNode(item, mode)}
                            </Form.Item>
                        )
                    })}
                    {/* <Form.Item>
                    <Button type="primary" htmlType="submit"
                        //className="login-form-button"
                        className="btn" 
                        
                    >
                        保存
                    </Button>
                    </Form.Item> */}

                </Form>
            ),
            onOk() {

                try {
                    // const values = addForm.validateFields();
                    // console.log(values);
                    // for (let index = 0; index < values.length; index++) {
                    //     const element = values[index];
                    //     console.log(element);
                    // }
                    addForm.submit();
                    //e.close();
                    // let values = addForm.getFieldsValue();
                    // if(values){
                    //     let newData = { rowIndex: count, id: count, ...values };

                    //     setTableData([...tabledata, newData]);

                    //     setCount(count + 1);
                    // }

                } catch (errorInfo) {
                }

                // let values = addForm.getFieldsValue();

                // let newData = { rowIndex: count, id: count, ...values };

                // setTableData([...tabledata, newData]);

                // setCount(count + 1);

            },
            onCancel() { },

            okText: '保存',
            cancelText: '关闭'
        });



    };


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


                {items.filter(item => item.isInEdit).map(item => {
                    return (
                        <Form.Item
                            name={item.dataIndex}
                            label={item.title}
                            style={{ margin: 'auto' }}
                            rules={
                                parseRules(item)
                            }
                        >
                            {parseInputNode(item, mode)}
                        </Form.Item>
                    )
                })}


                <div>
                    <Button
                        onClick={handleAdd}
                        type="primary"
                        hidden={mode === "details"}
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        新增租金标准
        </Button>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        rowKey="id"
                        bordered
                        columns={mergedColumns(cols)}
                        dataSource={tabledata}
                        size="lager"
                        pagination={{

                            //   total,
                            showSizeChanger: false,
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
                </div>

                <Form.Item>
                    <Button type="primary" htmlType="submit"
                        //className="login-form-button"
                        className="btn" onClick={onCommitButtonClick}
                        hidden={mode === 'details'}
                    >
                        保存
                    </Button>
                    {/* <Button type="primary" htmlType="reset"
                        //className="login-form-button"
                        className="btn" onClick={ResetValue}
                        hidden={mode === 'details'}
                    >
                        重置
                    </Button> */}
                    <Button type="primary" htmlType="reset"
                        //className="login-form-button"
                        className="btn" onClick={loadValue}
                        hidden={mode === 'details'}
                    >
                        选择产权资料
                    </Button>
                    <Button type="primary" htmlType="button"
                        //className="login-form-button"
                        className="btn"
                        onClick={onBackHome}
                    >
                        关闭
                    </Button >
                    {/* <Button type="primary" htmlType="button"
                        //className="login-form-button"
                        className="btn"
                        onClick={onTest}
                    >
                        调试
                    </Button > */}
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
        onToSelectRight: (formdata, tabledata, mode, rightno) => { keepFormdata(dispatch, { formdata, tabledata, mode, rightno }) },
        onBackClick: (page, limit) => { onBackHome(dispatch, { page, limit }) },
        // loadPropertyList: (page, limit, req,) => { onLoadTargetListByREQ(dispatch, { page, limit, req }) },
        onEditClick: (record, page, limit, newtable) => { onCommitEdit(dispatch, { record, page, limit, newtable }) },
        onCreateClick: (record, page, limit, tabledata) => { onCommitCreate(dispatch, { record, page, limit, tabledata }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZyContractEdit);

