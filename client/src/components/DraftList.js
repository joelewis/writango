import React, {Component} from "react";
import Model from "../models.js"
import { List, Card, Icon, Divider, Avatar, Popconfirm } from "antd";
import { Link, NavLink } from "react-router-dom";

class DraftList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            page: 1,
            finalPageloaded: false
        }
    }

    componentWillMount() {
        var self = this;
        Model.loadDrafts(this.props.match.params.username, this.state.page).then(resp => {
            console.log(resp)
            Model.drafts = Model.drafts.map(self.processPosts);
            var posts = this.state.posts;
            posts.push.apply(posts, Model.drafts)
            self.setState({
                posts: posts,
                finalPageloaded: this.state.page === resp.num_pages
            })
        })
    }

    processPosts(post) {
        if (post.fields.user) {
            post.editurl = "/writes/@"+post.fields.user.username + "/edit/" + self.fields.slug;
            post.viewurl = "/writes/@"+post.fields.user.username + "/posts/" + self.fields.slug;
            post.playurl = "/writes/@"+post.fields.user.username + "/play/" + self.fields.slug;
        } else {
            post.editurl = "/writes/@" + post.fields.session + "/edit/" + post.fields.slug;
            post.viewurl = "/writes/@" + post.fields.session + "/posts/" + post.fields.slug;
            post.playurl = "/writes/@" + post.fields.session + "/play/" + post.fields.slug;
        }
        return post;
    }

    loadMore() {
        let self = this;
        var page = this.state.page+1
        this.setState({page: page});
        Model.loadDrafts(this.props.match.params.username, page).then(resp => {
            Model.drafts = Model.drafts.map(self.processPosts);
            var posts = self.state.posts;
            posts.push.apply(posts, Model.drafts)
            self.setState({
                posts: posts,
                finalPageloaded: page === resp.num_pages
            })
        })
    }

    deletePost(post) {
        Model.deletePost(post.pk)
        var posts = this.state.posts.filter(p => {
            return p.pk != post.pk
        })
        this.setState({posts: posts})
    }

    render() {
        return (
            <Card className="width-60" style={{minHeight: '100vh', border: '0', margin: 'auto'}}>
                <Divider orientation="left">Drafts</Divider>
                {console.log(this.state)}
                {!this.state.posts.length && 
                    <div className="no-post-placeholder">
                        <p><Icon type="smile" style={{margin: '0 10px'}}/>You have no drafts yet. <a href="#">Start Writing!</a></p>
                    </div>
                }
                {!!this.state.posts.length && 
                    <div>
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.posts}
                        renderItem={item => (
                        <List.Item
                            actions={[
                                <Link to={item.editurl}>Edit</Link>, 
                                <Link to={item.viewurl}>View</Link>,
                                <Link to={item.playurl}>Play</Link>,
                                <Popconfirm title="Are you sure you want to delete this piece?" onConfirm={this.deletePost.bind(this, item)} okText="Yes" cancelText="No">
                                    <a>Delete</a>
                                </Popconfirm>
                            ]}
                            >
                            <List.Item.Meta
                            avatar={<Avatar>{item.fields.title[0]}</Avatar>}
                                title={<Link to={item.editurl}>{item.fields.title}</Link>}
                                description={new Date(item.fields.created_date).toDateString()}
                            />
                        </List.Item>
                        )}
                    />
                    <a href="#" style={{display: this.state.finalPageloaded ? 'none' : 'block'}} onClick={this.loadMore.bind(this)}>More</a>
                    </div>
                }
            </Card>

        )
    }
}

export default DraftList;