import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser, Node} from "prosemirror-model"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"
import schema from "./schema.js"
import {getPlugins} from "./setup.js"
import {PostPlayer, getEmptyDocJSON} from "./PostPlayer.js"
import {newPostJSON, newTitleJSON} from "./placeholders.js"

var getDocFromPost = function(post) {
    if (post.fields.text) {
        return post.fields.text;
    } else {
        return newPostJSON();
    }
}

var getTitleFromPost = function(post) {
    var titleJSON = newTitleJSON();
    if (post.fields.title) {
        titleJSON.content[0].text = post.fields.title;
    }
    return titleJSON;
}


var Editor = {
    init: function(div, opts) {
        var plugins = getPlugins({
            schema: schema,
            ...opts
        });

        var stateConfig = {
            schema: schema,
            plugins: plugins
        }

        stateConfig.doc = opts.empty ? Node.fromJSON(schema, getEmptyDocJSON()) : Node.fromJSON(schema, getDocFromPost(opts.post))

        var viewConfig =  {
            state: EditorState.create(stateConfig),
            attributes: {
                class: 'writango-post'
            },
            editable: () => {
                return opts.editable;
            },
            createSelectionBetween: function(view, from, to) {
                if (from != to) {
                    opts.onSelect && opts.onSelect();
                } else {
                    opts.onDeselect && opts.onDeselect();
                }
            }
        }

        if (opts.editable) {
            viewConfig.dispatchTransaction = (transaction) => {
                view.updateState(view.state.apply(transaction))
                opts.onChange(view.state.doc.toJSON())               
            }
        }

        if (opts.scrollMargin) {
            viewConfig.scrollMargin = {bottom: 400};
        }
        if (opts.scrollThreshold) {
            viewConfig.scrollThreshold = {bottom: 600};
        }
        if (opts.handleScrollToSelection) {
            viewConfig.handleScrollToSelection = opts.handleScrollToSelection; 
        }

        let view = new EditorView(div, viewConfig);   
        return view;
    },

    initTitleEditor: function(div, opts) {
        let textOnlySchema = new Schema({
          nodes: {
            text: {},
            doc: {content: "text*"}
          }
        })
        let stateConfig = {
            schema: textOnlySchema,
            doc: Node.fromJSON(textOnlySchema, getTitleFromPost(opts.post)),
        }

        let viewConfig = {
            state: EditorState.create(stateConfig),
            attributes: {
                class: 'writango-title'
            },
            editable: () => {
                return opts.editable;
            }
        }

        if (opts.editable) {
            viewConfig.dispatchTransaction = (transaction) => {
                view.updateState(view.state.apply(transaction))
                opts.onChange(view.state.doc.toJSON())               
            }
        }

        let view = new EditorView(div, viewConfig);
        return view;
    }
}

export {
    Editor,
    newPostJSON,
    PostPlayer,
    getEmptyDocJSON
}