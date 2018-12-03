import React, {Component} from "react";
import { Layout, Menu, Breadcrumb, Icon, Dropdown } from 'antd';
import { Row, Col } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import Landing from './Landing.js'
import PostList from './PostList.js'
import HomeMenu from './HomeMenu.js'
import Model from '../models'
import {createBrowserHistory} from 'history';
import $ from 'jquery';


// var PostList = () => <div> post list </div>
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
    constructor(props) {
        super(props)
        this.state = {
            selectedKey: ''
        }
    }

    setSelectedKey(key) {
        console.log(key);
        this.setState({selectedKey: key});
    }

    onSelect(item) {
        this.setState({selectedKey: item.key})
    }

    componentDidUpdate() {
    }

    render(){
      return(
        <Route path="/">
        <Layout className="layout">
            <Header className="writango-header">
            <div onClick={() => { $(window).trigger('RefreshMenu') }} className="writango-logo"><Link style={{ textDecoration: 'none',  color: '#555'}} to="/"> <span className="font-color-blue">W</span>RITANG<span className="font-color-blue">O</span></Link></div>
            <Dropdown overlay={Model.session.user.anonymous ? AnonymousMenu : UserMenu} trigger={['click']}>
                <a style={{float: "right"}} className="ant-dropdown-link" href="#">
                    {Model.session.user.anonymous ? "Hello, Mr. Anonymous!" : Model.session.user.email} <Icon type="down" />
                </a>
            </Dropdown>
            <HomeMenu selectedKey={this.state.selectedKey} onSelect={this.onSelect.bind(this)}/>
            </Header>
            <Content style={{ padding: '50px 50px', background: '#fff' }}>
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
        </Route>
      );
    }
}

export default Index
