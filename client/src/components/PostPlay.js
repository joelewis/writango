import React, {Component} from "react";
import Model from "../models.js"
import { List, Card, Icon, Divider } from "antd";
import { Editor, PostPlayer, getEmptyDocJSON } from '../editor'
import $ from 'jquery';

class PostPlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {},
            leftArrowDown: false,
            rightArrowDown: true
        }
        // create ref for prosemirror div
        this.editorDiv = React.createRef();
        this.editorShadowDiv = React.createRef();
        this.titleEditorDiv = React.createRef();
        this.menubarDiv = React.createRef();
        window.$ = $;
    }
    
    componentDidMount() {
        var self = this;
        Model.loadPost(this.props.match.params.username, this.props.match.params.postslug).then(() => {
            this.setState({post: Model.currentDoc})
            var editorDiv = this.editorDiv.current;
            var titleEditorDiv = this.titleEditorDiv.current;
            var shadowDiv = this.editorShadowDiv.current;
            window.editor = this.editor = Editor.init(editorDiv, {
                empty: true,  
                editable: false,
                handleScrollToSelection: this.handleScrollToSelection
            })
            window.titleEditor = this.titleEditor = Editor.initTitleEditor(titleEditorDiv, {
                post: this.state.post,
                editable: false
            })
            window.player = this.player = new PostPlayer(this.state.post, this.editor, shadowDiv);
            var shadowRect = shadowDiv.getBoundingClientRect();
            editorDiv.style.height = shadowRect.height + 'px';
            shadowDiv.style.display = 'none';
        })

        // TODO: this.handleKeydown.bind(this) is going to create a new instance of the method.
        // which means we lost reference to the method for usage with removeEventListener.
        // this is a possible memory leak case. Should work this problem around later.
        document.addEventListener("keydown", this.handleKeydown.bind(this), false);
    }

    repositionMenubar() {
        console.log(this.menubarDiv.current)
        var $menubar = $('.ProseMirror-menubar');
        $menubar.detach().appendTo(this.menubarDiv.current);
    }

    handleScrollToSelection(view) {
        var $body = $(document.body)
        var viewdomRect = view.dom.getBoundingClientRect();
        let bottomOffset = viewdomRect.top + viewdomRect.height;
        let viewportHeight = window.innerHeight;
        let spaceLeftToBottom = viewportHeight - bottomOffset;
        if (spaceLeftToBottom < 100) { // 100 is the bottom margin for content
            $body.animate({scrollTop: $body.scrollTop() + viewportHeight - $('.writango-menu-container').height() - 200}, 500);
        }
        return true;
    }

    componentWillUnmount() {
        // TODO: this.handleKeydown.bind(this) is going to create a new instance of the method.
        // which means we lost reference to the method during removeEventListener.
        // this is a possible memory leak case. Should work this problem around later.
        document.removeEventListener("keydown", this.handleKeydown.bind(this), false);
    }

    handleKeydown(e) {
        var self = this;
        switch (e.keyCode) {
            // case 38: {
            //     //up arrow
            //     this.prev();
            //     break;
            // }
            // case 40: {
            //     // down arrow
            //     this.next()
            //     break;
            // }
            case 37: {
                // left arrow
                this.setState({
                    leftArrowDown: true
                });
                setTimeout(() => {
                    this.setState({leftArrowDown: false})
                }, 200);
                
                
                this.prev();
                break;
            }
            case 39: {
                // right arrow
                this.setState({
                    rightArrowDown: true
                });
                setTimeout(() => {
                    this.setState({rightArrowDown: false})
                }, 200);

                this.next()
                break;
            }
        }
    }

    next() {
        if (this.player.hasNext()) {
            this.player.next();
        } else {
            // show message for content-end-reached
        }

    }

    prev() {
        if (this.player.hasPrev()) {
            this.player.prev();
        } else {
            // show message for no-more-previous
        }
    }

    render() {
        if (this.state.post.fields) {
            return (
                <div>
                    {/* <Card style={{minHeight: '100vh', border: '0', width: '600px', margin: 'auto'}}> */}
                    <Card className="writango-post-container" style={{minHeight: '100vh', border: '0', width: '800px', margin: 'auto'}}>
                        <div className="prosemirror-title-div" ref={this.titleEditorDiv}>
                        </div>
                        <div className="post-body">
                            <div className="prosemirror-div" ref={this.editorDiv}>
                            </div>
                            <div style={{visibility: 'hidden'}} className="prosemirror-shadow-div" ref={this.editorShadowDiv}>
                            </div>
                        </div>
                    </Card>

                    <div className="writango-controls">
                        <Icon onClick={this.prev.bind(this)} className={"writango-control-btn " + (this.state.leftArrowDown ? "writango-control-btn-selected" : "")} type="caret-left"></Icon>
                        <Icon onClick={this.next.bind(this)} className={"writango-control-btn " + (this.state.rightArrowDown ? "writango-control-btn-selected" : "")} type="caret-right"></Icon>
                    </div>
                </div>
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

export default PostPlay;