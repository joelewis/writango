import React, {Component} from "react";
import Model from "../models.js"
import { List, Card, Icon, Divider } from "antd";
import { Editor } from '../editor'
class PostView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {}
        }

        // create ref for prosemirror div
        this.editorDiv = React.createRef();
        this.titleEditorDiv = React.createRef();
    }

    componentWillMount() {
        var self = this;
        Model.loadPost(this.props.match.params.username, this.props.match.params.postslug).then(() => {
            this.setState({post: Model.currentDoc})
            var editorDiv = this.editorDiv.current;
            var titleEditorDiv = this.titleEditorDiv.current;
            window.editor = Editor.init(editorDiv, {
                post: this.state.post,  
                editable: false
            })
            window.titleEditor = Editor.initTitleEditor(titleEditorDiv, {
                post: this.state.post,
                editable: false
            })
        })
    }

    render() {
        if (this.state.post.fields) {
            return (
                <Card className="writango-post-container" style={{minHeight: '100vh', border: '0', width: '800px', margin: 'auto'}}>
                <div className="prosemirror-title-div" ref={this.titleEditorDiv}>
                </div>
                {/* <h1>{this.state.post.fields.title}</h1> */}
                <div className="post-body">
                    <div className="prosemirror-div" ref={this.editorDiv}>
                    </div>
                </div>
                </Card>
            )
        }
        return (<div></div>)
    }
}

export default PostView;