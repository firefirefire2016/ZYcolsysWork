import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Select, Popconfirm, Radio, Input, Form, Switch, message, Spin } from 'antd'
import { sysCols } from '../../../utils/listConfig'
import { connect } from 'react-redux';
import { selectItems, parseItemtype, parseTypeToLabel, parseInputNode, parseRules, consoleTarget } from '../../../utils/ItemUtils';
import { strToTime, timeToStr } from '../../../utils/common';
import { onCommitCreate, onCommitEdit,onfetchContract } from '../../../store/actions/zyPropertyAct';


const items = sysCols.propertyCol.filter(item => item.isInEdit);

const { Option } = Select;

function PropertyRightEdit(props) {

    const [form] = Form.useForm();

    const [value, setValue] = useState('');

    const [isInitDrop,setInitDrop] = useState(true);

    // const [data, setData] = useState([]);

    // const [fetching, setFetching] = useState(false);

    const { onEditClick, onCreateClick,fetchContract } = props;

    const { record, isCreating, page, limit, id, res, mode } = props.zyPropertyData;

    const { fetchData,fetching } = props.zyContractData;


    let obj;

    const ResetValue = async () => {

        form.resetFields();

    }

    useEffect(() => {

        switch (mode) {
            case 'home':
                props.history.push('/admin/propertyRight');
                break;
            case 'creating':
                //message.info('准备创建');
                form.resetFields();
                break;
            case 'editing':
                obj = new Object(record);

                form.setFieldsValue({
                    ...obj
                });
                break;
            case 'details':
                obj = new Object(record);

                form.setFieldsValue({
                    ...obj
                });
                break;
            default:
                break;
        }


    }, [mode])

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

                onEditClick(row, 'COMMIT_Edit')
            }

        } catch (error) {
            message.warn(error.message);
        } finally {



        }
    }


    //保存提交
    function onCommitButtonClick() {

    }

    const fetchContractClick = value => {

       // console.log('fetching user', value);
        // this.lastFetchId += 1;
        // const fetchId = this.lastFetchId;

        // setData([]);
        // setFetching(true);

        // fetch('https://randomuser.me/api/?results=5')
        //     .then(response => response.json())
        //     .then(body => {
        //         // if (fetchId !== this.lastFetchId) {
        //         //     // for fetch callback order
        //         //     return;
        //         // }
        //         const _data = body.results.map(user => ({
        //             text: `${user.name.first} ${user.name.last}`,
        //             value: user.login.username,
        //         }));
        //         //this.setState({ data, fetching: false });
        //         setData(_data);
        //         setFetching(false);
        //     });
        console.log('value = ' + value);
        fetchContract(value);
    }

    const handleChange = value => {
         setValue(value);
        // setData([]);
        // setFetching(false);
    };


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
                            {parseInputNode(item, mode)}
                        </Form.Item>
                    )
                })}
                <Form.Item
                    hidden={true}
                           // name={item.dataIndex}
                            label={'选择合同(动态加载)'}
                        >
                <Select
                    //mode="tags"
                    allowClear={true}
                    showSearch={true}
                    labelInValue
                    value={value}
                    placeholder="加载合同（测试）"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={fetchContractClick}
                    onChange={handleChange}
                    onFocus={()=>{
                        if(isInitDrop){
                            setInitDrop(false);
                            fetchContract('');
                        }
                    }}
                    style={{ width: '200px' }}
                    onSelect={(data,option)=>{
                        const _data = JSON.parse(data.key);
                        form.setFieldsValue({
                            ..._data
                        })
                        console.log(_data.simpleaddress);
                    }}
                >
                    {/* {fetchData.map(d => (
                        <Option key={JSON.stringify(d)} >{d.billno}</Option>
                    ))} */}
                </Select>
                </Form.Item>
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
        // loadTargetList: (page, limit, req,) => { onLoadPropertyData(dispatch, { page, limit, req }) },
        onEditClick: (record) => { onCommitEdit(dispatch, { record }) },
        onCreateClick: (record) => { onCommitCreate(dispatch, { record }) },
        fetchContract:(billno) =>{ onfetchContract(dispatch,{billno}) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyRightEdit);

