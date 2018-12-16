import React, {Component} from "react";
import { Layout, Menu, Breadcrumb, Icon, Dropdown } from 'antd';
import { Row, Col } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import Landing from './Landing.js'
import PostList from './PostList.js'
import PostEdit from './PostEdit.js'
import PostView from './PostView.js'
import PostPlay from './PostPlay.js'
import DraftList from './DraftList.js'
import HomeMenu from './HomeMenu.js'
import AuthScreen from './AuthScreen.js'
import Model from '../models'
import {createBrowserHistory} from 'history';
import $ from 'jquery';



const AnonymousMenu = (
    <Menu>
      <Menu.Item key="0">
        <Link to="/writes/auth/register">Register</Link>
      </Menu.Item>
      <Menu.Item key="1">
      <Link to="/writes/auth/login">Login</Link>
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
            <Dropdown  className="writango-menu-container" overlay={Model.session.user.anonymous ? AnonymousMenu : UserMenu} trigger={['click']}>
                <a style={{float: "right"}} className="ant-dropdown-link" href="#">
                    {Model.session.user.anonymous ? "Hello, Mr. Anonymous!" : Model.session.user.email} <Icon type="down" />
                </a>
            </Dropdown>
            <HomeMenu selectedKey={this.state.selectedKey} onSelect={this.onSelect.bind(this)}/>
            </Header>
            <Content className="width-100" style={{ padding: '20px 20px', background: '#fff', margin: 'auto', marginTop: '20px' }}>
                    <div>
                    <Route path="/" exact component={Landing} />
                    <Route path="/writes/:username" exact component={PostList} />
                    <Route path="/writes/:username/drafts" exact component={DraftList} />
                    <Route path="/writes/:username/posts/:postslug" exact component={PostView} />
                    <Route path="/writes/:username/edit/:postslug" exact component={PostEdit} />
                    <Route path="/writes/:username/play/:postslug" exact component={PostPlay} />
                    <Route path="/writes/auth/:page" exact component={AuthScreen} />
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
