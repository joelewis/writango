import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser, Node} from "prosemirror-model"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"
import schema from "./schema.js"
import {getPlugins} from "./setup.js"




var newPostJSON = () => {
    return {"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Start writing your post here…"}]}]};
};


var newTitleJSON = () => {
    return {"type":"doc","content":[{"type":"text","text":"Untitled Post"}]};
}; 


var getDocFromPost = function(post) {
    if (post.fields.text) {
        return JSON.parse(post.fields.text);
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
            schema: schema
        });

        var stateConfig = {
            doc: Node.fromJSON(schema, getDocFromPost(opts.post)),
            schema: schema,
            plugins: plugins
        }

        var viewConfig =  {
            state: EditorState.create(stateConfig),
            attributes: {
                class: 'writango-post'
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
    newPostJSON
}