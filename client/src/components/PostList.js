import React, {Component} from "react";
import Model from "../models.js"
import { List, Card, Icon, Divider, Avatar, Popconfirm } from "antd";
import { Link } from "react-router-dom";

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
        Model.loadPosts(this.props.match.params.username, this.state.page).then(resp => {
            console.log(resp)
            Model.posts = Model.posts.map(self.processPosts);
            var posts = this.state.posts;
            posts.push.apply(posts, Model.posts)
            self.setState({
                posts: posts,
                finalPageloaded: this.state.page === resp.num_pages
            })
        })
    }

    processPosts(post) {
        if (post.fields.author) {
            post.editurl = "/writes/@"+post.fields.author.username + "/edit/" + post.fields.slug;
            post.viewurl = "/writes/@"+post.fields.author.username + "/posts/" + post.fields.slug;
            post.playurl = "/writes/@"+post.fields.author.username + "/play/" + post.fields.slug;
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
        Model.loadPosts(this.props.match.params.username, page).then(resp => {
            Model.posts = Model.posts.map(self.processPosts);
            var posts = self.state.posts;
            posts.push.apply(posts, Model.posts)
            self.setState({
                posts: posts,
                finalPageloaded: page === resp.num_pages
            })
        })
    }

    deletePost(post) {
        Model.deletePost(post.fields.slug)
        var posts = this.state.posts.filter(p => {
            return p.fields.slug != post.fields.slug
        })
        this.setState({posts: posts})
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

    isOwner(post) {
        return post.fields.author.username === Model.session.user.username || post.fields.session === Model.session.user.username;
    }   

    render() {
        return (
            <Card className="width-60" style={{minHeight: '100vh', border: '0', margin: 'auto'}}>
                <Divider orientation="left">Posts</Divider>
                {!this.state.posts.length && 
                    <div className="no-post-placeholder">
                        <p><Icon type="smile" style={{margin: '0 10px'}}/>You have no drafts yet. <a onClick={this.createDraft.bind(this)}>Start Writing!</a></p>
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
                                <Link to={item.playurl}>Play</Link>,
                                <Link to={item.viewurl}>View</Link>,
                                <Link style={{display: this.isOwner(item) ? 'block': 'none' }} to={item.editurl}>Edit</Link>,
                                <Popconfirm title="Are you sure you want to delete this piece?" onConfirm={this.deletePost.bind(this, item)} okText="Yes" cancelText="No">
                                    <a style={{display: this.isOwner(item) ? 'block': 'none' }}>Delete</a>
                                </Popconfirm>
                            ]}
                            >
                            <List.Item.Meta
                            avatar={<Avatar>{item.fields.title[0]}</Avatar>}
                                title={<Link to={item.playurl}>{item.fields.title}</Link>}
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