import React, {Component} from "react";
import Model from "../models.js"
import { List, Card, Icon, Divider } from "antd";
class PostList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }

    componentWillMount() {
        var self = this;
        Model.loadPosts(this.props.match.params.username).then(() => {
            self.setState({
                posts: Model.posts.map(function(post) {
                    post.url = "/writes/@" + post.fields.user ? post.fields.username : post.fields.session + "/posts/" + post.fields.slug;
                    return post;
                })
            })
        })
    }

    render() {
        return (
            <Card style={{minHeight: '100vh', border: '0'}}>
                <Divider orientation="left">Posts</Divider>
                {!this.state.posts.length ? 
                    (<div className="no-post-placeholder">
                        <p><Icon type="smile" style={{margin: '0 10px'}}/>You have no posts yet. <a href="#">Start Writing!</a></p>
                    </div>)
                    :
                    (<List
                        itemLayout="horizontal"
                        dataSource={this.state.posts}
                        renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                            avatar={<Avatar>{item.fields.title[0]}</Avatar>}
                                title={<Link to={item}>{item.fields.title}</Link>}
                            description={new Date(item.fields.created_date).toDateString()}
                            />
                        </List.Item>
                        )}
                    />)
                }
            </Card>
        )
    }
}

export default PostList;