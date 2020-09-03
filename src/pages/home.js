/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { Link,useHistory} from 'react-router-dom'
import { Modal,Table, Button,Form,Input,  Popconfirm, notification,Select, message} from 'antd';
import axios from 'axios'
import './home.scss'
import './config'
import { webconfig } from '../webConfig'
import Wel from './mergeCols'
import { render } from 'sass';
//import Modal from 'antd/lib/modal/Modal';

const { Option } = Select;

export default function Home(){

    const [data,setData] = useState([]);

    //设置表格索引，点击切换数据源和表格
    const [index,setIndex] = useState(0);

    const [col,setCol] = useState([]);

    const [form] = Form.useForm();

    const [sourceUrl,setSourceUrl] = useState('zyContract');

    const [editingKey, setEditingKey] = useState('');

    const [isInit,setIsInit] = useState(true);

    const [changeCount,setChange] = useState(0);

    //const [mywindowUrl,setUrl] = useState('91a8810fa273.ngrok.io');

    const [warned,setWarned] = useState(false);


    //单位性质
    //const unittypes = [{'type':'国企单位'},{'type':'私营单位'},{'type':'合资单位'}]

    const unitts = ['国企单位','私营单位','合资单位'];

    const renttypes = ['公开招租','梅花办带合同移交','苗圃场职工安置房','狮山办带合同移交','续租'];
   

    const isEditing = record => record.id === editingKey;

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        isWarn,
        index,
        children,
        rowIndex,
        ...restProps
      }) => {
        let inputNode = <Input type={inputType} />;
        
       // console.log(' rowIndex: ' + rowIndex);
       // console.log(' record: ' + JSON.stringify(record) );
        
        switch (inputType) {
          case 'SelectUnit':
            inputNode = <Select  >
           {unitts.map((temp,index) => (
            <Option key={index} >{temp}</Option>
            ))} 
          </Select>;
            break;
          case 'SelectRentType':
            inputNode = <Select  >
           {renttypes.map((temp,index) => (
            <Option key={index} >{temp}</Option>
            ))} 
          </Select>;
            break;
        
          default:
            break;
        }

        // if(inputType === 'SelectUnit'){
        //   inputNode = <Select  >
        //    {unittypes.map((temp,index) => (
        //     <Option key={index} >{temp.type}</Option>
        //   ))} 
        //   </Select>;
        // }
        
         return (
          <td {...restProps} type='primary' className={(isWarn )?'warn':''}>
            {editing ? (
              <Form.Item
                name={dataIndex}
                // style={{
                //   margin: 0,
                // }}
                rules={[
                  {
                    required: true,
                    message: `请输入 ${title}!`,
                  },
                ]}
              >
                {inputNode}
              </Form.Item>
            ) : 
            // (inputType ===  'SelectUnit'?(record.unit_type?unitts[record.unit_type]:''):
            //   (children)
            // )
            getLabel(record,inputType,children)
              
            }
          </td>
        );
      };

      const getLabel = (record,inputType,chil)=>{
        switch(inputType){
          case 'SelectUnit':
            //return record.unit_type?unitts[record.unit_type]:'';
            return unitts[record.unit_type];
            break;
          case 'SelectRentType':
            return  renttypes[record.renttype];
            break;
          default:
            return chil;
            break;
        }
        
      }


      const getWeb = async()=>{
       // console.log(' url = ' + mywindowUrl);
        await axios({
            method: 'post',
            headers:{'Content-type':'application/json'},
            url: 'http://'+ webconfig.ipAndport + '/' + sourceUrl + '/list/3/1/200',
            data: '',
        }).then(function (res) {
            if(res.data.code === 1){
                console.log(res.data.msg);
            }else{
                if(sourceUrl === 'zyCollection'){
                  let rows = res.data.rows;
                  //let warnDetails = '';
                  let warnArray = [];
                  var contractSum = [0];
                  var notices = [];
                  rows.forEach( (row,index,rows) => {
                     //console.log(' value: ' + JSON.stringify(value) );
                     //console.log(' index: ' + JSON.stringify(index));
                     //console.log(' row: ' + JSON.stringify(row));
                     row['contractno'] = row.zycontract.contractno;
                     row['isWarn'] = 0;
                     //如果已收金额小于应收金额，则提醒
                     //console.log(' 差额：' + (row.amount_received < row.amount_receivable)); 
                     let date = new Date();
                     let currentYear = date.getFullYear();

                     let currentMonth = date.getMonth() + 1;
                     
                     console.log('当前月份为' + currentMonth + '当前年份为' + currentYear);

                     let yearInt = parseInt(row.year);

                     let monthInt = parseInt(row.month);

                     if(row.amount_received - row.amount_receivable < 0 && row.status === 1 ){
                       if(yearInt < currentYear){
                          row.isWarn = 1;
                       }
                       else if(yearInt === currentYear && monthInt <= currentMonth){
                          row.isWarn = 1;
                       }
                       else{
                         row.isWarn = 0;
                       }
                          
                     }

                     if(row.isWarn === 1 && warned === false ){
                       var noticecontent = '合同编号为' + row.contractno + '的' + row.year + '年' + row.month + 
                       '月份的租金未收齐，请留意!';

                       var key = row.contractid;

                       var notice = {};
                       notice.id = key;
                       notice.content = noticecontent;

                       notices.push(notice);

                      // openNotification('租金拖欠',notice,warnDetails,'warning');

                       //console.log(' id: ' + row.contractid);

                       var info = row.year + '年' + row.month + '月份的租金目前只收到' + row.amount_received +
                        '，仍拖欠' + (row.amount_receivable - row.amount_received) + '元<br/>';

                       // console.log(info);

                        if(!contractSum.includes(row.contractid) ){
                          contractSum.push(row.contractid);
                          let temp = {};
                          temp.title = '合同编号为' + row.contractno + '的收款情况如下:';
                          temp.contractid = row.contractid;
                          temp.detail =  info  ;
                          warnArray.push(temp);
                        }

                        warnArray.forEach((warn,index,warns)=>{                         
                         if(warn.contractid === row.contractid){
                           warn.detail += info ;
                           return;
                         }

                        })

                       

                     }


                     
                  });

                  //openNotification('租金拖欠',notice,warnDetails,'warning');

                 // console.log (JSON.stringify(warnArray)  );
                  let time = 1;
                  notices.forEach((notice,index,nos)=>{
                    warnArray.forEach((warn,index,warns)=>{
                      if(notice.id === warn.contractid){
                        openNotification('租金拖欠',notice.content,warn.title,warn.detail,'warning',time);
                        time = time+0.3;
                        return;
                      }
                    })
                    
                  })

                  setWarned(true);

                  
                  // message.warning(warnArray[0]).then()
                  // warnArray.forEach(async row=>{
                  //     await message.warning(row);
                  // })

                }
                
                //console.log('res.data.rows =' + JSON.stringify(change) );
                setData(res.data.rows);
                console.log(res.data);
            }                
        }).catch(function (error) {
            console.log(error.message);
        });
    }

    useEffect(()=>{

        if(isInit){
          setCol(contractCol);
          setIsInit(false);
        }
        
        

        try{
            //resetSourceUrl(index);
            
            getWeb();   

        }
        catch(err){
            console.log(err);
        }
        


    },[sourceUrl,changeCount]);

    

    const edit = record => {
        form.setFieldsValue({
        //   name: '',
        //   age: '',
        //   address: '',
         // contractno : '20180806',
          ...record
        });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey('');
      };

    const save = async key => {
        try {
           const row = await form.validateFields();
           row.id = key;
          // const newData = [...data];
           console.log('更新的记录为' + row);
          // const index = newData.findIndex(item => key === item.id);


           //直接在接口调用，后台更新数据
           const updateWeb = async()=>{
            await axios({
                method: 'post',
                headers:{'Content-type':'application/json'},
                url: 'http://'+ webconfig.ipAndport + '/' + sourceUrl + '/update',
                data: row,
            }).then(function (res) {
                if(res.code === 1){
                    //后台问题打印
                    message.warn(res.msg);
                }
                else{
                  setChange(changeCount+1);
                  setEditingKey('');

                }                
            }).catch(function (error) {
                message.warn(error.message);
            });
          }
          updateWeb();  
          

          // if (index > -1) {
          //   //找到这个要换掉的记录
          //   const item = newData[index];
          //   newData.splice(index, 1, { ...item, ...row });
          //   setData(newData);
          //   setEditingKey('');
          // } else {
          //   newData.push(row);
          //   setData(newData);
          //  setEditingKey('');
          // }
        } catch (errInfo) {
            message.warn('保存失败:' + errInfo);
        }
      };

      const confirmDel = async (id,status = -1) =>{

        let target = {'id':id,'status':status}

        try {
          
          console.log(' 删除目标' + target);
          await axios({
            method: 'post',
            headers:{'Content-type':'application/json'},
            url: 'http://'+ webconfig.ipAndport + '/' + sourceUrl + '/update_status',
            data: target,
          }).then(function (res) {
            if(res.code === 1){
                //后台问题打印
                console.log(res.msg);
            }
            else{
                
                console.log('删除成功');
                setEditingKey('');
                setChange(changeCount+1);
            }                
          }).then(async function (res){

            //相应的收款表也做删除状态处理
            if(sourceUrl === 'zyContract'){
              await axios({
                method: 'post',
                headers:{'Content-type':'application/json'},
                url: 'http://'+ webconfig.ipAndport + '/zyCollection/delbyContract',
                data: target,
              }).then(function (res) {
                if(res.code === 1){
                    //后台问题打印
                    console.log(res.msg);
                }
                else{
                    
                    console.log('删除收款表成功');
                    setEditingKey('');
                    //setChange(changeCount+1);
                }                
              })
              }
            }
            
          ).catch(function (error) {
            console.log(error);
          });
          
          
        } catch (error) {
          
        }
      }
      

      function detailInfo(title,content) {
        Modal.info({
          //title: 'This is a notification message',
          // content: (
          //   <div>
          //     <p>该合同于XXXX年XX月签订：</p>
          //     <p>合同现状描述。。。</p>
          //   </div>
          // ),
          title,
          content:(<div dangerouslySetInnerHTML={{ __html: content }}/>),
          onOk() {},
          okText:'好的'
        });
      }
      
      //弹窗欠款提醒
      const openNotification = (title,description,modaltitle,detail,type,time) => {
        //const key = `open${Date.now()}`;
        const btn = (
          <Button type="primary" size="small" onClick={async()=>{
              //console.log(detail);
              detailInfo(modaltitle,detail);          
          }}
          >
            查看详情
          </Button>
        );

        const close = () => {
          console.log(
            '提醒欠款栏关闭.',
          );
        };

        notification[type]({
          message:title,
          description,
          btn,
          duration:time,
          //key,
          onClose: close,
        });
      };  

      const parseInputNode = (dataIndex)=>{
          let inputnode = 'text';
          switch (dataIndex) {
            case 'startdate':
              inputnode = 'date';
              break;
            case 'enddate':
              inputnode = 'date';
              break;
            case 'deposit':
              inputnode = 'number';
              break;
            case 'tel_tenant':
              inputnode = 'number';
              break;
            case 'unit_type':
              inputnode = 'SelectUnit';
              break;
            case 'renttype':
              inputnode = 'SelectRentType';
              break;
            default:
              inputnode = 'text';
              break;
          }
          return inputnode;
      }

    //合同表
    const contractCol= [
        {
            title:'合同编号',
            dataIndex:'contractno',
            editable:true
            
        },
        {
            title:'起始日期',
            dataIndex:'startdate',
            editable:true,
            //width:'12%'
        },
        {
            title:'终止日期',
            dataIndex:'enddate',
            editable:true,
            //width:'12%'
        },
        {
          title:'收款日',
          dataIndex:'rentdate',
          editable:true,
          //width:'10%'
        },
        {
            title:'招租方式',
            dataIndex:'renttype',
            editable:true,
            //width:'10%'
        },
        // {
        //   title:'承租方',
        //   dataIndex:'tenant',
        //   editable:true,
        //   width:'10%'
        // },
        // {
        //   title:'联系电话',
        //   dataIndex:'tel_tenant',
        //   editable:true,
        //   width:'10%'
        // },
        // {
        //   title:'押金',
        //   dataIndex:'deposit',
        //   editable:true,
        //   width:'10%'
        // },
        {
          title:'每月租金',
          dataIndex:'month_rent',
          editable:true,
          //width:'10%'
        },
        {
            title:'产权证编号',
            dataIndex:'rightno',
            editable:true,
            //width:'10%'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          editable:false,
          isOper:true,
          width:250
        }
    ];

    

    //出租收款表
    const rentCol= [
        {
            title:'合同编号',
            dataIndex:'contractno',
            editable:true
        },
        {
          title:'收款年份',
          dataIndex:'year',
          editable:true
        },
        {
            title:'收款月份',
            dataIndex:'month',
            editable:true
        },
        {
            title:'已收款金额',
            dataIndex:'amount_received',
            editable:true
        },
        {
            title:'应收金额',
            dataIndex:'amount_receivable',
            editable:true
        },
        {
            title:'开票金额',
            dataIndex:'invoice_amount',
            editable:true
        },
        {
          title: '操作',
          dataIndex: 'operation',
          editable:false,
          isOper:true
        }
        
    ];

    //单位表
    const unitCol= [
        {
            title:'单位名称',
            dataIndex:'unit_name',
            editable:true
        },
        {
            title:'单位性质',
            dataIndex:'unit_type',
            editable:true
        },
        {
            title:'单位联系人',
            dataIndex:'unit_contacts',
            editable:true
        },
        {
            title:'联系电话',
            dataIndex:'unit_tel',
            editable:true
        },
        {
            title:'单位住址',
            dataIndex:'unit_add',
            editable:true
        },
        {
          title: '操作',
          dataIndex: 'operation',
          editable:false,
          isOper:true
        }
    ];

    //水电费表
    const waterEleCol= [
        {
            title:'抄表月份',
            dataIndex:'check_month',
            editable:true
        },
        {
            title:'缴费物业地址',
            dataIndex:'property_add',
            editable:true
        },
        {
            title:'收款月份',
            dataIndex:'get_month',
            editable:true
        },
        {
            title:'电费托收金额',
            dataIndex:'elecol_amount',
            editable:true
        },
        {
            title:'电费抄表金额',
            dataIndex:'elecheck_amount',
            editable:true
        },
        {
            title:'电费到账金额',
            dataIndex:'elereceived_amount',
            editable:true
        },
        {
            title:'水费托收金额',
            dataIndex:'watercol_amount',
            editable:true
        },
        {
            title:'水费抄表金额',
            dataIndex:'watercheck_amount',
            editable:true
        },
        {
            title:'水费到账金额',
            dataIndex:'waterreceived_amount',
            editable:true
        },
        {
            title:'是否在租',
            dataIndex:'is_rent',
            editable:true
        },
        {
          title: '操作',
          dataIndex: 'operation',
          editable:false,
          isOper:true
          
        }
    ];


    const mergedColumns = col.map(col => {
      //console.log(' col.isOper: ' + col.isOper);
      if (!col.editable) {

        if(col.isOper === true){
          col.render = (text, record,index) => {
            //console.log('到这里显示了');
            const editable = isEditing(record);
           // editable = true;
            return editable ? (
              <span>
                <a
                  //href=""
                  onClick={() => save(record.id)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  保存
                </a>
                
                <a onClick={cancel} >取消</a>
                
                
                  
              </span>
            ) : (
              <span>
              <Button type="primary" disabled={editingKey !== ''} onClick={() => edit(record)}
              style={{
                marginRight: 8,
              }}>
                编辑
              </Button>
              <Popconfirm 
                  title='确定删除么?'
                  onCancel={()=>cancel}
                  onConfirm={()=>confirmDel(record.id)}
                  disabled={editingKey !== ''||sourceUrl=== 'zyCollection'}
                 >
              <Button type="primary" hidden={sourceUrl === 'zyCollection'}  disabled={editingKey !== ''}
              style={{
                marginRight: 8,
              }}>
                    删 除
              </Button>
              </Popconfirm>

              <Popconfirm 
                  title='确定终止该合同么?'
                  onCancel={()=>cancel}
                  onConfirm={()=>confirmDel(record.id,2)}
                  disabled={editingKey !== ''|| record.status === 2}
                 >
              <Button type="primary" hidden={sourceUrl !== 'zyContract'}  disabled={editingKey !== '' || record.status === 2}
              style={{
                marginRight: 8,
              }}>
                    终止
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
        
        onCell: (record,rowIndex) => (
            
      {
          //record,
          inputType: parseInputNode(col.dataIndex),
          rowIndex,
          isWarn: record.isWarn?true:false,
          //isWarn:rowIndex === record.
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          record
        }
        ),
      };
    });


    const history = useHistory();
    
    function onAddRecord(){
        let targetUrl = '/';
        switch (index) {
          case 0:
            targetUrl = '/addContract'
            break;
          case 1:
            targetUrl = '/addCollection'
            break;
          case 2:
            targetUrl = '/addUnit'
            break;
          case 3:
            targetUrl = '/addWaterEle'
            break;
          default:
            break;
        }
        history.push(targetUrl);
        
    }


    return     <div className='home'>

        <h1>正圆资产管理系统</h1>
        <div className='wrap'>
            <div className='nav'>
                
                <a className={index === 0?('checked'):''} onClick={()=>{
                    setIndex(0);
                    setCol(contractCol);
                    setSourceUrl('zyContract');
                    setEditingKey('');
                }} >合同表</a>
                <a className={index === 1?('checked'):''} onClick={()=>{
                    setIndex(1);
                    setCol(rentCol);
                    setSourceUrl('zyCollection');
                    setEditingKey('');
                }} >出租收款表</a>
                <a className={index === 2?'checked':''} onClick={()=>{
                    setIndex(2);
                    setCol(unitCol);
                    setSourceUrl('zyUnit');
                    setEditingKey('');
                }} >单位表</a>
                <a className={index === 3?'checked':''} onClick={()=>{
                    setIndex(3);
                    setCol(waterEleCol);
                    setSourceUrl('zyWaterEle');
                    setEditingKey('');
                }} >水电费表</a>
            </div>
            <p>数据演示</p>
            <Form form={form} component={false}>
            <Table 
                components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                bordered
                columns={mergedColumns}
                dataSource={data}
                size="lager"
                // scroll={{ x: 'calc(700px + 50%)', y: 350 }}
                scroll={{  y: 350 }}
                />
            </Form>
            
            <Button className='btn' type='primary' hidden={index===1?true:false} onClick={onAddRecord}>新增</Button>
            
            <br/>
            <Link to="/" className='linkcs'>回到首页</Link>

            <Wel />
        </div>
        
    </div>
}

