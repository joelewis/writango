import React, {Component} from "react";
import Model from "../models.js"
import { Card, Button } from "antd";
import { Editor } from '../editor'
import $ from 'jquery';


class PostView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {},
            selectionActive: false,
            loading: true
        }

        // create ref for prosemirror div
        this.editorDiv = React.createRef();
        this.titleEditorDiv = React.createRef();
        this.menubarDiv = React.createRef();
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
            this.setState({post: Model.currentDoc, loading: false})
            var editorDiv = this.editorDiv.current;
            var titleEditorDiv = this.titleEditorDiv.current;
            window.editor = Editor.init(editorDiv, {
                onChange: this.debounce(this.onPostChange.bind(this), 1000),
                post: this.state.post,
                editable: true,
                menubar: true,
                onSelect: this.onSelect.bind(this),
                onDeselect: this.onDeselect.bind(this)
            })
            window.titleEditor = Editor.initTitleEditor(titleEditorDiv, {
                onChange: this.debounce(this.onTitleChange.bind(this), 1000),
                post: this.state.post,
                editable: true
            })
            this.repositionMenubar()    
        })
    }

    repositionMenubar() {
        var $menubar = $('.ProseMirror-menubar');
        $menubar.detach().appendTo(this.menubarDiv.current);
    }

    onSelect() {
        this.setState({selectionActive: true});
    }

    onDeselect() {
        this.setState({selectionActive: false});
    }

    publish() {
        Model.publishDraft(this.state.post.pk).then(resp => {
            // redirect to posts listing
            window.location.href = '/writes/' + this.props.match.params.username
        })
    }

    play() {

    }

    view() {

    }

    delete() {

    }

    render() {
        if (this.state.post.fields) {
            return (
                <Card 
                    className="writango-post-container" 
                    style={{minHeight: '100vh', border: '0', width: '800px', margin: 'auto'}}
                    extra={
                        <Button.Group>
                            <Button type="primary" onClick={this.publish.bind(this)}>Publish</Button>
                            <Button>Play</Button>
                            <Button>View</Button>
                            <Button type="danger">Delete</Button>
                        </Button.Group>
                        }
                >
                    <div style={{visibility: this.state.selectionActive ? 'visible' : 'hidden' }} className="writango-prosemirror-menubar-container" ref={this.menubarDiv}>
                    </div>
                    <div className="prosemirror-title-div" ref={this.titleEditorDiv}>
                    </div>
                    <div className="post-body">
                        <div className="prosemirror-div" ref={this.editorDiv}>
                        </div>
                    </div>
                </Card>
            )
        } else if (this.state.loading) {
            return (
                <div style={{minHeight: '100vh'}}></div>
            )
        }
        return (
            <div style={{minHeight: '100vh', width: '800px', margin: 'auto'}}>
                <p>
                    Sorry, either the requested post doesn't exist or you don't have necessary permissions to view the content.
                </p>                
            </div>
        )
    }
}

export default PostView;