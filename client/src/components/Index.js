import React, {Component} from "react";
import { Layout, Menu, Breadcrumb } from 'antd';
import { Row, Col } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

class Index extends Component{
    render(){
      return(
        <Layout className="layout">
            <Header className="writango-header">
            <div className="writango-logo"> WRITANG-O- </div>
            <Menu
                // theme="dark"
                mode="horizontal"
                // defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
                className="writango-menu-container"
            >
                <Menu.Item key="1">Posts</Menu.Item>
                <Menu.Item key="2">Editor</Menu.Item>
                {/* <Menu.Item key="3">nav 3</Menu.Item> */}
            </Menu>
            </Header>
            <Content style={{ padding: '0 50px', background: '#fff' }}>
                <div className="landing-block">
                    <h3> What's Writango?</h3>
                    <p>Writango is just another writing and publishing platform, but with a minor difference.</p>
                    <p>It lets your readers play your content and read your write-up, sentence by sentence instead of throwing up the text chunk entirely on-screen.</p>
                </div>
                <div className="landing-block">
                    <h3> Write & Publish. No sign-up required. </h3>
                    <p>
                        Use Writango when you want to quickly write something and present it to an audience. You don't even have to sign-up or sign-in. 
                        <a href="#">Take a look.</a>
                    </p>
                </div>
                <div className="landing-block">
                    <h3> It's free & open-sourced. </h3>
                    <p>
                        There's no fee for hosting your writes. Text hosting is cheap. Even when the day arrives when the hosting charges surpasses the threshold, you'll be able to export your writes and host your own Writango. 
                    </p>
                    <p>The source code is open-sourced at <a href="#">github.com/joelewis/writango</a></p>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Just another weekend project created with the awesome <a href="https://github.com/prosemirror">Prosemirror</a> library & other open source technologies. Follow me <a href="https://twitter.com/@vettijoe">@vettijoe</a>, <a href="https://github.com/joelewis">github.com/joelewis</a> and <a href="https://hexopress.com/@joe">hexopress.com/@joe</a>.
            </Footer>
        </Layout>
      );
    }
}

export default Index