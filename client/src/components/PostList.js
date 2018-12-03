import React, {Component} from "react";
import Model from "../models.js"
import { List, Card, Icon } from "antd";
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
                posts: Model.posts
            })
        })
    }

    render() {
        return (
            <Card title="Posts" style={{minHeight: '100vh'}}>
                <div className="no-post-placeholder">
                    <p><Icon type="smile" style={{margin: '0 10px'}}/>You have no posts yet. <a href="#">Start Writing!</a></p>
                </div>
            </Card>

        )
    }
}

export default PostList;