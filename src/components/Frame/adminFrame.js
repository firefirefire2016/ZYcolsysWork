import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import { withRouter } from 'react-router-dom';
import { HomeOutlined, UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';
import { connect } from 'react-redux';

import logo from './logo.png';
import { admins } from '../../routes/routesData';
import SubMenu from 'antd/lib/menu/SubMenu';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_2040335_dr890g0m4wo.js'
  ],
});



const routes = admins.filter(route => route.isShow);

//const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

//className="site-layout-background"
function adminFrame(props) {
  return (
    <Layout >
      <Header className="header">
        <div className="logo" >
          <img src={logo} alt="logo" />
        </div>
      </Header>
      <Layout >
        <Sider width={200} style={{ backgroundColor: "#fff" }} >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            {routes.map(route => {
              return (

                <SubMenu key={route.path} icon={<IconFont type={route.icon} style={{ fontSize: '30px' }} />} title={route.title}>

                  {route.children.map(child => {
                    return (
                      <Menu.Item key={child.path}
                        onClick={p => {
                          props.history.push(p.key);
                        }}
                        style={{ margin: '20px 0 0 0px' }}>
                        <IconFont type={child.icon} style={{ fontSize: '30px' }} />
                        {child.title}
                      </Menu.Item>
                    )
                  })}
                </SubMenu>

              )
            })}
          </Menu>
        </Sider>
        <Layout style={{ padding: '16px' }} >
          <Content
            className="site-layout-background"
            
            style={{
              padding: 24,
              margin: 0,
              //height:'100%',
              minHeight: 280,
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

const mapStatetoProps = state => state;

export default connect(mapStatetoProps)(withRouter(adminFrame)) 
