import React  from 'react';
//import ReactDOM from 'react-dom';
import { useHistory} from 'react-router-dom'
import { Form, Input, Button, message,Select,} from 'antd';
//import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './add.scss'
import axios from 'axios'

import { webconfig } from '../webConfig'
//import cdata from '../../public/contraData.json'

const { Option } = Select;

const AddContractForm = () => {

  const history = useHistory();

  //const [mywindowUrl,setUrl] = useState('91a8810fa273.ngrok.io');

  const renttypes = ['公开招租','梅华办带合同移交','苗圃场职工安置房','狮山办带合同移交','续租'];

  const [form] = Form.useForm();

  const onFinish = async values => {
    //let _contractid = 0;
    let reData = {};
    try {
      let newinstance = {
        contractno:values.contractno,
        startdate:values.startdate,
        enddate:values.enddate,
        renttype:values.renttype,
        rightno:values.rightno,
        rentdate:values.rentdate,
        tenant:values.tenant,
        tel_tenant:values.tel_tenant,
        deposit:values.deposit,
        month_rent:values.month_rent
      }
      
      await axios({
        method: 'post',
        headers:{'Content-type':'application/json'},
        url: 'http://'+ webconfig.ipAndport + '/zyContract/create',
        data: newinstance,
      }).then(function (res) {
        if(res.code === 1){
            message.warn(res.msg);
            return;
        }
        else{
            reData = res.data.data;

            message.success('创建合同成功！');
            
            
        }  
        
                     
      }).then(async function(res){
          //创建1到12月的收款

          //let tempYear =  values.startdate;

          let tempsYear = parseInt(values.startdate.toString().substring(0,4));

          let tempsMonth = parseInt(values.startdate.toString().substring(5,7)) ;

          let tempeYear = parseInt(values.enddate.toString().substring(0,4)) ;

          let tempeMonth = parseInt(values.enddate.toString().substring(5,7)) ;

          console.log('初始到结束的年月：' + tempsYear + tempsMonth + tempeYear + tempeMonth);

          //结束的年月改成当前年月
          let date = new Date();
          let currentYear = date.getFullYear();
          let currentMonth = date.getMonth();



          

          console.log('当前年=' + currentYear + '当前月=' + currentMonth);

          // console.log(reData.id);
          //创建收款表
          createColletions(tempsYear,currentYear,tempsMonth,currentMonth+1,reData);
          
          
      }
        
      ).catch(function (error) {
        message.warn(error.message);
      });
    } catch (error) {
      message.warn(error.message);
    }
    
  };

  //创建收款表的实现
  const createColletions = async (tempsYear,tempeYear,tempsMonth,tempeMonth,reData)=>{
    let resetyear = false;

          let endmonth = 12;

            for (let year = tempsYear; year < tempeYear + 1; year++) {
              if(year === tempeYear){
                endmonth = tempeMonth;
              }
              if(resetyear === true){
                tempsMonth = 1;
                
                resetyear = false;
              }
              
              for (let month = tempsMonth; month < endmonth + 1; month++) {
                                
                let newCollection = {
                  contractid:reData.id,
                  status:1,
                  year:year,
                  month:month,
                  amount_receivable:reData.month_rent
                }
                await axios({
                  //创建合同后，相应的收款表也创建
                  method: 'post',
                  headers:{'Content-type':'application/json'},
                  url: 'http://'+ webconfig.ipAndport + '/zyCollection/create',
                  data: newCollection,
      
                // eslint-disable-next-line no-loop-func
                }).then(function (res){
                  if(res.code === 1){
                    message.warn(res.msg);
                    return;
                  }
                  else{
                    if(month === 12){
                      resetyear = true;
                    }
                  } 
        
                  
                })
              }
              
            
            }
          message.success('创建对应收款表成功！');

          history.push('/home');
  }

  
  


  const AddContract = async()=>{       
        
  }

  const BackHome = async()=>{
    history.push('/home');
  }

  const ResetValue = async()=>{
    form.resetFields();

    // let date = new Date();
    //       let currentYear = date.getFullYear();
    //       let currentMonth = date.getMonth();



          

    //       console.log('当前年=' + currentYear + '当前月=' + currentMonth);
  }

  return (
    <div className='addFrom'>
    <Form
     
      name="contractAdd"
      //className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      className='wrap'
    >
      <Form.Item
        name="contractno"
        label='合同编号'
        rules={[
          {
            required: true,
            message: '请输入合同编号',
          },
        ]}
      >
        <Input  placeholder="合同编号" type="text"
        
        />
      </Form.Item>


      <Form.Item
        label='起始日期'
        name="startdate"
        rules={[
          {
            required: true,
            message: '请输入起始日期',
          },
        ]}
      >
        <Input
          className="site-form-item-icon"
          type="date"
          placeholder="起始日期"
        //   onChange={(event)=>{
        //       setSdate(event.target.value);
        //   }}

        />
      </Form.Item>


      <Form.Item
        name="enddate"
        label='终止日期'
        rules={[
          {
            required: true,
            message: '请输入终止日期',
          },
        ]}
      >
        <Input
          type="date"
          placeholder="终止日期"
        />
      </Form.Item>

      <Form.Item
        name="rentdate"
        label='收款日期'
        rules={[
          {
            required: true,
            message: '请输入收款日期',
          },
        ]}
      >
        <Input
          type="number"
          
          placeholder="收款日期"
        />
      </Form.Item>



      <Form.Item
        label='招租方式'
        name="renttype"
        rules={[
        {
          required: true,
          message: '请选择招租方式',
        }]}
      >
        <Select 
          //defaultValue='0'
          //onChange={this.onSecondCityChange}        
        >
           {renttypes.map((type,index) => (
            <Option key={index} value={index}>{type}</Option>
          ))} 
        </Select>
      </Form.Item>

      <Form.Item
        label='承租方 '
        name="tenant"
        rules={[
          {
            required: true,
            message: '请输入承租方',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="承租方"
        //   onChange={(event)=>{
        //     setRtype(event.target.value);
        //   }}
        />
      </Form.Item>

      <Form.Item
        label='联系电话'
        name="tel_tenant"
        rules={[
          {
            required: true,
            message: '请输入联系电话',
          },
        ]}
      >
        <Input
          type="number"
          placeholder="联系电话"
        //   onChange={(event)=>{
        //     setRtype(event.target.value);
        //   }}
        />
      </Form.Item>

      <Form.Item
        label='押金  '
        name="deposit"
        rules={[
          {
            required: true,
            message: '请输入押金',
          },
        ]}
      >
        <Input
          type="number"
          placeholder="押金"
        //   onChange={(event)=>{
        //     setRtype(event.target.value);
        //   }}
        />
      </Form.Item>

      <Form.Item
        label='每月租金'
        name="month_rent"
        rules={[
          {
            required: true,
            message: '请输入每月租金',
          },
        ]}
      >
        <Input
          type="number"
          placeholder="每月租金"
        //   onChange={(event)=>{
        //     setRtype(event.target.value);
        //   }}
        />
      </Form.Item>


      <Form.Item
        label='产权证号'
        name="rightno"
        rules={[
          {
            required: true,
            message: '请输入产权证号',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="产权证号"
        //   onChange={(event)=>{
        //     setRno(event.target.value);
        //   }}
        />
      </Form.Item>

      {/* <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item> */}

      <Form.Item>
        <Button type="primary" htmlType="submit" 
         //className="login-form-button"
         className="btn" onClick={AddContract}
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
         onClick={BackHome}
        >
          返回
        </Button >
      </Form.Item>
    </Form>
    </div>
  );
};

export default AddContractForm;