import React, {Component} from "react";
import Model from "../models.js"
import { List, Card, Icon, Divider, Avatar } from "antd";
import { Link, NavLink } from "react-router-dom";

class DraftList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }

    componentWillMount() {
        var self = this;
        Model.loadDrafts(this.props.match.params.username).then(() => {
            Model.drafts = Model.drafts.map(function(post) {
                if (post.fields.user) {
                    post.editurl = "/writes/@"+post.fields.user.username + "/edit/" + self.fields.slug;
                    post.viewurl = "/writes/@"+post.fields.user.username + "/posts/" + self.fields.slug;
                } else {
                    post.editurl = "/writes/@" + post.fields.session + "/edit/" + post.fields.slug;
                    post.viewurl = "/writes/@" + post.fields.session + "/posts/" + post.fields.slug;
                }
                return post;
            });
            self.setState({
                posts: Model.drafts
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

    render() {
        return (
            <Card style={{minHeight: '100vh', border: '0'}}>
                <Divider orientation="left">Drafts</Divider>
                {console.log(this.state)}
                {!this.state.posts.length && 
                    <div className="no-post-placeholder">
                        <p><Icon type="smile" style={{margin: '0 10px'}}/>You have no drafts yet. <a href="#">Start Writing!</a></p>
                    </div>
                }
                {!!this.state.posts.length && 
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.posts}
                        renderItem={item => (
                        <List.Item
                            actions={[
                                <Link to={item.editurl}>Edit</Link>, 
                                <Link to={item.viewurl}>View</Link>,
                                <a onClick={() => {this.deletePost(item)}}>Delete</a>
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
                }
            </Card>

        )
    }
}

export default DraftList;