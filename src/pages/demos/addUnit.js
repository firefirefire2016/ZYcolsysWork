import React  from 'react';
//import ReactDOM from 'react-dom';
import { useHistory} from 'react-router-dom'
import { Form, Input, Button,Select, message} from 'antd';

//import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './add.scss'
import axios from 'axios'
//import { FormInstance } from 'antd/lib/form';

import { webconfig } from '../../webConfig'

const { Option } = Select;

const AddUnitForm = () => {

  const history = useHistory();

  const [form] = Form.useForm();

  //const [mywindowUrl,setUrl] = useState('91a8810fa273.ngrok.io');

  const unittypes = ['国企单位','私营单位','合资单位'];

  const onFinish = async values => {
    try {
      let newinstance = {
        unit_name:values.unit_name,
        unit_type:values.unit_type,
        unit_contacts:values.unit_contacts,
        unit_tel:values.unit_tel,
        unit_add:values.unit_add
      }
     
      await axios({
        method: 'post',
        headers:{'Content-type':'application/json'},
        url: 'http://'+ webconfig.ipAndport + '/zyUnit/create',
        data: newinstance,
      }).then(function (res) {
        if(res.code === 1){
            message.warning(res.msg);
        }
        else{
          message.success('创建成功！');
        }             
      }).catch(function (error) {
        message.warning(error.message);
      });
      
    } catch (error) {
      message.warning(' 错误代码：' + error.message);
    }
    
  };

  
  


  const AddContract = async()=>{       
    
  }

  const BackHome = async()=>{
    history.push('/home');
  }

  const ResetValue = async()=>{
    form.resetFields();
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
      form={form}
    >
      <Form.Item
        name="unit_name"
        rules={[
          {
            required: true,
            message: '请输入单位名称',
          },
        ]}
      >
        <Input  placeholder="单位名称" type="text"
        
        />
      </Form.Item>



      <Form.Item
        name="unit_type"
        rules={[
        {
          required: true,
          message: '请选择单位性质',
        }]}
      >
        <Select 
          //defaultValue='0'
          //onChange={this.onSecondCityChange}        
        >
           {unittypes.map((type,index) => (
            <Option key={index} value={index}>{type}</Option>
          ))} 
        </Select>
      </Form.Item>


      <Form.Item
        name="unit_contacts"
        rules={[
          {
            required: true,
            message: '请输入联系人',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="联系人"
        //   onChange={(event)=>{
        //     setEdate(event.target.value);
        //   }}
        />
      </Form.Item>


      <Form.Item
        name="unit_tel"
        rules={[
          {
            required: true,
            message: '请输入联系方式',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="联系方式"
        //   onChange={(event)=>{
        //     setRtype(event.target.value);
        //   }}
        />
      </Form.Item>


      <Form.Item
        name="unit_add"
        rules={[
          {
            required: true,
            message: '请输入联系地址',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="联系地址"
        //   onChange={(event)=>{
        //     setRno(event.target.value);
        //   }}
        />
      </Form.Item>


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

export default AddUnitForm;