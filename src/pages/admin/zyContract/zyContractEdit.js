import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message, Layout, Modal, InputNumber, Spin } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode, parseRules, consoleTarget, getSelectNode } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit,onBackHome } from '../../../store/actions/zyContractAct';
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

    const { rightnos, selects } = props.zyPropertyData;

    const { record, isCreating, page, limit, mode, res, rentlist } = props.zyContractData;

    const { onEditClick, onCreateClick, loadPropertyList,onBackClick} = props;

    //const { rentList } = props.zyRentlistData;

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

        Modal.confirm({
            title: '租金标准',
            visible: true,

            content: (
                <Form form={modalForm} layout="vertical" name="userForm"
                    initialValues={{
                        ...record
                    }}
                    onFinish={values => {
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
                let values = modalForm.getFieldsValue();

                let newData = new Object(tabledata);

                newData[index] = { id: newData[index].id, ...values };

                setTableData([...newData]);

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

        // console.log(JSON.stringify(record));
    }

    const loadValue = () => {

        console.log(rightnos);

        let index = form.getFieldValue('rightno');

        //console.log(index);
        form.setFieldsValue({
            ...rightnos[index]
        })


    }

    useEffect(() => {
        console.log(' mode = ' + mode);
        console.log(res);

        if(mode === 'home'){
            props.history.push('/admin/zyContract');
        }

        if (res !== null) {
            props.history.push('/admin/zyContract');
        }
        else {
            loadPropertyList(1, -1);

            if (rentlist) {
                setTableData(rentlist);
            }

            //getSelectNode();

            if (isCreating === false) {

                let obj = new Object(record);

                let nItems = edititems.filter(item => {
                    return (parseItemtype(item.dataIndex) === 'date')
                })

                nItems.forEach((item, index, items) => {
                    if (obj[item.dataIndex]) {
                        obj[item.dataIndex] = strToTime(obj[item.dataIndex]);
                    }

                })

                //console.log(obj);


                form.setFieldsValue({
                    ...obj
                });
            }
            else {
                message.info('准备创建');
                form.resetFields();
            }

        }



    }, [res,mode])

    const onBackHome = () => {

        onBackClick();
        //props.history.push('/admin/zyContract');
    }

    const onFinish = values => {
        try {

            let row = form.getFieldValue();


            let nItems = edititems.filter(item => {
                return (parseItemtype(item.dataIndex) === 'date')
            })

            nItems.forEach((item, index, items) => {
                row[item.dataIndex] = timeToStr(row[item.dataIndex]);

            })

            if (isCreating) {

                row['rightid'] = rightnos[row.rightno].id;

                row['rightno'] = selects[row.rightno];

                //创建合同同时，创建租金标准
                onCreateClick(row, page, limit, tabledata);

            } else {

                let _record = new Object(record);

                row['id'] = _record.id;

                console.log(row);

                onEditClick(row, page, limit, tabledata);

            }

        } catch (error) {
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

                </Form>
            ),
            onOk() {
                let values = addForm.getFieldsValue();

                let newData = { rowIndex: count, id: count, ...values };

                // if (tabledata.length <= 0) {
                //     setTableData([newData]);
                // }
                // else {
                setTableData([...tabledata, newData]);
                //}

                setCount(count + 1);

            },
            onCancel() { },

            okText: '提交',
            cancelText: '取消'
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
                            {parseInputNode(item, mode, selects)}
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
                            showSizeChanger: true,
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
                        提交
                    </Button>
                    <Button type="primary" htmlType="reset"
                        //className="login-form-button"
                        className="btn" onClick={ResetValue}
                        hidden={mode === 'details'}
                    >
                        重置
                    </Button>
                    <Button type="primary" htmlType="reset"
                        //className="login-form-button"
                        className="btn" onClick={loadValue}
                        hidden={mode === 'details'}
                    >
                        加载产权资料
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
        onBackClick: (page, limit) => { onBackHome(dispatch, { page, limit}) },
        loadPropertyList: (page, limit, req,) => { onLoadTargetListByREQ(dispatch, { page, limit, req }) },
        onEditClick: (record, page, limit, newtable) => { onCommitEdit(dispatch, { record, page, limit, newtable }) },
        onCreateClick: (record, page, limit, tabledata) => { onCommitCreate(dispatch, { record, page, limit, tabledata }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZyContractEdit);

