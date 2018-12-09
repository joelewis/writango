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

    debounce(func, wait) {
        var timeout;
        var self = this;
        return function() {
            clearTimeout(timeout);
            const args = arguments;
            timeout = setTimeout(() => {
                func.apply(self, args);
            }, wait);
        };
    }

    onPostChange(postJSON) {
        // post postJSON to server
        let post = this.state.post;
        post.fields.text = postJSON;
        this.setState({post});
        let params = this.props.match.params;
        Model.editDraft(params.username, params.postslug, post);
    }

    onTitleChange(titleJSON) {
        let title = 'Untitled Post';
        var doc = titleJSON;
        if (doc.content && doc.content[0].text) {
            title = doc.content[0].text;
        }
        // post title to server
        let post = this.state.post;
        post.fields.title = title;
        this.setState({post});
        let params = this.props.match.params;
        Model.editDraft(params.username, params.postslug, post);
    }

    componentWillMount() {
        var self = this;
        Model.loadPost(this.props.match.params.username, this.props.match.params.postslug).then(() => {
            this.setState({post: Model.currentDoc})
            var editorDiv = this.editorDiv.current;
            var titleEditorDiv = this.titleEditorDiv.current;
            window.editor = Editor.init(editorDiv, {
                onChange: this.debounce(this.onPostChange.bind(this), 1000),
                post: this.state.post,
                editable: true
            })
            window.titleEditor = Editor.initTitleEditor(titleEditorDiv, {
                onChange: this.debounce(this.onTitleChange.bind(this), 1000),
                post: this.state.post,
                editable: true
            })
        })
    }

    componentDidMount() {
        
    }

    render() {
        if (this.state.post.fields) {
            return (
                <Card style={{minHeight: '100vh', border: '0', width: '600px', margin: 'auto'}}>
                <div className="prosemirror-title-div" ref={this.titleEditorDiv}>
                </div>
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