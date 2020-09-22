import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message, Layout, Modal, InputNumber } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode, parseRules, consoleTarget } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit } from '../../../store/actions/zyContractAct';
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

    const { record, isCreating, page, limit, mode } = props.zyContractData;

    const { onEditClick, onCreateClick, loadPropertyList } = props;

    const { rentList } = props.zyRentlistData;

    const [tabledata, setTableData] = useState([]);


    let obj;

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
                            >
                                编辑
                    </Button>



                            <Popconfirm
                                title='确定删除?'
                                onConfirm={() => {
                                    handleDelete(record)
                                }}
                            >
                                <Button type="primary"

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
                        //console.log('检查一下' + JSON.stringify(values) + JSON.stringify(record) );

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

                console.log(tabledata);
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
        //form.resetFields();

        // let row = form.getFieldsValue();

        // let index = row.rightno;

        // row.area = rightnos[index].area;
        // row.insidearea = rightnos[index].insidearea;
        // row.address = rightnos[index].address;
        // row.simpleaddress = rightnos[index].simpleaddress;

        // form.setFieldsValue({
        //     ...row,
        // });

        console.log(tabledata);

    }

    useEffect(() => {

        loadPropertyList(1, -1);

        if (rentList) {
            setTableData(rentList);
        }

        if (isCreating === false) {

            obj = new Object(record);

            let nItems = items.filter(item => {
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


            let nItems = items.filter(item => {
                return (parseItemtype(item.dataIndex) === 'date')
            })


            nItems.forEach((item, index, items) => {
                row[item.dataIndex] = timeToStr(row[item.dataIndex]);

            })


            if (isCreating) {

                //创建合同同时，创建租金标准
                await onCreateClick(row, page, limit, tabledata);




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

    const getPlus = (item) => {

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

                let newData = { rowIndex:count, id: count, ...values };

                if (tabledata.length <= 0) {
                    setTableData([newData]);
                }
                else {
                    setTableData([...tabledata, newData]);
                }

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
                <Select style={{ width: '200px' }}
                    onSelect={() => {
                    }}
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch={true}
                >
                    <Option key={1}>1</Option>
                </Select>

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
    return state;
}

const mapDispatchToProps = (dispatch, ownprops) => {
    return {
        loadPropertyList: (page, limit, req,) => { onLoadTargetListByREQ(dispatch, { page, limit, req }) },
        onEditClick: (record, page, limit) => { onCommitEdit(dispatch, { record, page, limit }) },
        onCreateClick: (record, page, limit, tabledata) => { onCommitCreate(dispatch, { record, page, limit, tabledata }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZyContractEdit);

