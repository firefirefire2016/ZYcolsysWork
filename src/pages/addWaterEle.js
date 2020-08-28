import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import { useHistory} from 'react-router-dom'
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './add.scss'
import axios from 'axios'

import { webconfig } from '../webConfig'
//import cdata from '../../public/contraData.json'

const AddWaterEleForm = () => {

  const history = useHistory();

  const onFinish = async values => {
    try {
      let newinstance = {
        check_month:values.check_month,
        property_add:values.property_add,
        get_month:values.get_month,
        elecol_amount:values.elecol_amount,
        elecheck_amount:values.elecheck_amount,
        elereceived_amount:values.elereceived_amount,
        watercol_amount:values.watercol_amount,
        watercheck_amount:values.watercheck_amount,
        waterreceived_amount:values.waterreceived_amount,
        is_rent:values.is_rent
      }
      await axios({
        method: 'post',
        headers:{'Content-type':'application/json'},
        url: 'http://' + webconfig.ipAndport + '/zyWaterEle/create',
        data: newinstance,
      }).then(function (res) {
        if(res.code === 1){
            console.log(res.msg);
        }
        else{
            console.log(res.data);
        }  
        history.push('/home');              
      }).catch(function (error) {
        console.log(error);
      });
    } catch (error) {
      
    }
    
  };

  
  


  const AddContract = async()=>{       
        
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
        name="check_month"
        rules={[
          {
            required: true,
            message: '请输入抄表月份',
          },
        ]}
      >
        <Input  placeholder="抄表月份" type="text"
        
        />
      </Form.Item>


      <Form.Item
        name="property_add"
        rules={[
          {
            required: true,
            message: '请输入缴费物业地址',
          },
        ]}
      >
        <Input
          className="site-form-item-icon"
          type="text"
          placeholder="缴费物业地址"
        //   onChange={(event)=>{
        //       setSdate(event.target.value);
        //   }}

        />
      </Form.Item>


      <Form.Item
        name="get_month"
        rules={[
          {
            required: true,
            message: '请输入收款月份',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="收款月份"
        //   onChange={(event)=>{
        //     setEdate(event.target.value);
        //   }}
        />
      </Form.Item>


      <Form.Item
        name="elecol_amount"
        rules={[
          {
            required: true,
            message: '请输入电费托收金额',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="电费托收金额"
        //   onChange={(event)=>{
        //     setRtype(event.target.value);
        //   }}
        />
      </Form.Item>


      <Form.Item
        name="elecheck_amount"
        rules={[
          {
            required: true,
            message: '请输入电费抄表金额',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="电费抄表金额"
        />
      </Form.Item>

      <Form.Item
        name="elereceived_amount"
        rules={[
          {
            required: true,
            message: '请输入电费到账金额',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="电费到账金额"
        />
      </Form.Item>

      <Form.Item
        name="watercol_amount"
        rules={[
          {
            required: true,
            message: '请输入水费托收金额',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="水费托收金额"
        />
      </Form.Item>

      <Form.Item
        name="watercheck_amount"
        rules={[
          {
            required: true,
            message: '请输入水费抄表金额',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="水费抄表金额"
        />
      </Form.Item>

      <Form.Item
        name="waterreceived_amount"
        rules={[
          {
            required: true,
            message: '请输入水费到账金额',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="水费到账金额"
        />
      </Form.Item>

      <Form.Item
        name="is_rent"
        rules={[
          {
            required: true,
            message: '请输入是否在租',
          },
        ]}
      >
        <Input
          type="text"
          placeholder="是否在租"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" 
         //className="login-form-button"
         className="btn" onClick={AddContract}
        >
          提交
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default AddWaterEleForm;