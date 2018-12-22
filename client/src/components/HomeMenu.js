import React, {Component} from 'react';
import {createBrowserHistory} from 'history';
import {Menu, Icon} from 'antd';
import {Link} from "react-router-dom";
import Model from '../models.js'
import $ from 'jquery';

class HomeMenu extends Component {

    constructor(props) {
        super(props);
        // this.history = createBrowserHistory()
        // window.historyy = this.history;
        this.state = {
            selectedKeys: []
        }
    }

    componentWillMount() {
        var self = this;
        window.j = $; 
        $(window).on('RefreshMenu', function() {
            self.setState({selectedKeys: []})
        })
    }

    componentWillUnmount() {
    }

    onSelect(item) {
        this.setState({selectedKeys: [item.key]})
    }

    createDraft() {
        Model.createDraft().then((resp) => {
            console.log(resp);
            var post = resp;
            if (post.fields.author) {
                var edit_url = "/writes/@"+post.fields.author.username + "/edit/" + post.fields.slug;
            } else {
                var edit_url = "/writes/@" + post.fields.session + "/edit/" + post.fields.slug;
            }
            window.location.href = edit_url;
        })
    }

    render() {
        return (<Menu
            // theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[]}
            selectedKeys={this.state.selectedKeys}
            style={{ lineHeight: '64px' }}
            className="writango-menu-container" 
            onSelect={this.onSelect.bind(this)}
        >
            <Menu.Item key="posts" ><Link to={"/writes/@"+Model.session.user.username}><Icon type="global" style={{color: "#52c41a"}} />Posts</Link></Menu.Item>
            <Menu.Item key="drafts"><Link to={"/writes/@"+Model.session.user.username+"/drafts"}><Icon type="save" theme="twoTone" twoToneColor="#eb2f96" />Drafts</Link></Menu.Item>
            <Menu.Item key="write" onClick={this.createDraft.bind(this)}><Icon type="edit" theme="twoTone" />Write</Menu.Item>
            {/* <Menu.Item key="3">nav 3</Menu.Item> */}
        </Menu>
        )
    }
}

export default HomeMenu;