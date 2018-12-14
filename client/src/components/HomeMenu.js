import React, {Component} from 'react';
import {createBrowserHistory} from 'history';
import {Menu} from 'antd';
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
            var post = resp;
            if (post.fields.user) {
                var edit_url = "/writes/@"+post.fields.user.username + "/edit/" + self.fields.slug;
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
            <Menu.Item key="posts" ><Link to={"/writes/@"+Model.session.user.id}>Posts</Link></Menu.Item>
            <Menu.Item key="drafts"><Link to={"/writes/@"+Model.session.user.id+"/drafts"}>Drafts</Link></Menu.Item>
            <Menu.Item key="write" onClick={this.createDraft.bind(this)}>Write</Menu.Item>
            {/* <Menu.Item key="3">nav 3</Menu.Item> */}
        </Menu>
        )
    }
}

export default HomeMenu;