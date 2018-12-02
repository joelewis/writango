import React, {Component} from "react";
import { Layout, Menu, Breadcrumb, Icon, Dropdown } from 'antd';
import { Row, Col } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Landing from './Landing.js'
import Model from '../models'


var PostList = () => <div> post list </div>
var DraftList = () => <div> draft list </div>
var PostView = () => <div> post view </div>
var PostEdit = () => <div> post edit </div>


const AnonymousMenu = (
    <Menu>
      <Menu.Item key="0">
        <a href="/register">Sign-up</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="/login">Login</a>
      </Menu.Item>
    </Menu>
);

const UserMenu = (
    <Menu>
      <Menu.Item key="0">
        <a href="/logout">Logout</a>
      </Menu.Item>
    </Menu>
);

class Index extends Component{
    render(){
      return(
        <Layout className="layout">
            <Header className="writango-header">
            <div className="writango-logo"><Link style={{ textDecoration: 'none',  color: '#555'}} to="/"> <span className="font-color-blue">W</span>RITANG<span className="font-color-blue">O</span></Link></div>
            <Dropdown overlay={Model.session.user.anonymous ? AnonymousMenu : UserMenu} trigger={['click']}>
                <a style={{float: "right"}} className="ant-dropdown-link" href="#">
                    {Model.session.user.anonymous ? "Hello, Mr. Anonymous!" : Model.session.user.email} <Icon type="down" />
                </a>
            </Dropdown>
            <Menu
                // theme="dark"
                mode="horizontal"
                // defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
                className="writango-menu-container"
            >
                <Menu.Item key="1"><Link to={"/writes/posts"}>Posts</Link></Menu.Item>
                <Menu.Item key="2">Drafts</Menu.Item>
                <Menu.Item key="3">Write</Menu.Item>
                {/* <Menu.Item key="3">nav 3</Menu.Item> */}
            </Menu>
            </Header>
            <Content style={{ padding: '0 50px', background: '#fff' }}>
                    <div>
                    <Route path="/" exact component={Landing} />
                    <Route path="/writes/:username" exact component={PostList} />
                    <Route path="/writes/:username/drafts" exact component={DraftList} />
                    <Route path="/writes/:username/posts/:postslug" exact component={PostView} />
                    <Route path="/writes/:username/edit/:postslug" exact component={PostEdit} />
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
