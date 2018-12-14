import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser, Node} from "prosemirror-model"
import {undo, redo, history} from "prosemirror-history"

import schema from "./schema.js"


// input [{node, idx, method}]
var groupOps = (ops) => {
    return ops.reduce((composedOps, currentOp, idx, ops) => {
        var lastOps = composedOps[composedOps.length-1];
        var lastOp = lastOps[lastOps.length-1]
        if (!lastOp) {
            lastOps.push(currentOp);
        } else if (lastOp.method === 'insert') {
            lastOps.push(currentOp);
        } else {
            composedOps.push([currentOp]);
        }
        return composedOps;
    }, [[]])
};

const breakSentences = paraNode => {
    //regular expression to break sentences.
    const reg = new RegExp(/[(\.|\?|\!|\n|\r)]/, 'gi');
  
    let txt = paraNode.textBetween(0, paraNode.content.size, '|', '%');
    
    var match = null;
    var breaks = [];
    while(match = reg.exec(txt)) {
      breaks.push(match.index);
    }
  
    var start = 0;

    if (!breaks.length) {
        // record the entire para as a slice
        return [paraNode.slice(0, paraNode.content.size)];
    }

    var slices = breaks.map(function(idx) {
      var slice = paraNode.slice(start, idx+1)
      start = idx+1;
      return slice;
    });
    slices.push(paraNode.slice(start, paraNode.content.size)); // to push the last left out part.

    slices = slices.filter(slice => {
        return slice.content.content.length;
    })
  
    return slices;
}

const getOps = doc => {
    var blocksInContent = doc.content.content;
    var docIdx = 0;
    var ops = [];

    var recordOp = function(idx, node, method) {
        ops.push({idx, node, method});
    }


    // record ops for sentences.
    var processSentences = sentences => {
        sentences.forEach(slice => {
            recordOp(docIdx, slice, 'replace');
            docIdx += slice.content.size;
        })
    }
  
    var processNode = node => {
      if (node.content.size) {
          // record block creation op
        var emptyBlock = node.copy();
        recordOp(docIdx, emptyBlock, 'insert')
        docIdx++;
        
        // recursively reach para node and then break it up into sentences.
        var fragment = node.content.content;
        if (node.type.name === 'paragraph' || node.type.name === 'heading') {
          var sentences = breakSentences(node, docIdx);
          processSentences(sentences);
        } else {
          fragment.forEach(function(node) {
            processNode(node);
          })
        }
        docIdx++;
      }
    }
  
    blocksInContent.forEach(function(block, i) {
      // var emptyBlock = block.copy();
      // insertBlock(docIdx, emptyBlock)
      // docIdx++;
      processNode(block);
      // docIdx++;
    })

    return ops;
}


var getEmptyDocJSON = () => {
    return {"type":"doc","content":[{"type":"paragraph","content":[]}]};
}

class PostPlayer {
    constructor(post, view, shadowDiv) {
        this.post = post;

        // prosemirror view instance that's initiated ona non-existing dom-element.
        // this.shadow = new EditorView(document.querySelector("#does-not-exist"), {
        this.shadow = new EditorView(shadowDiv, {
            state: EditorState.create({
              doc: Node.fromJSON(schema, post.fields.text ? post.fields.text : getEmptyDocJSON()),
              plugins: [
                history(),
              ]
            }),
            attributes: {
                class: 'writango-post'
            },
        });

        this.view = view;
        // ops to play content
        this.ops = getOps(this.shadow.state.doc);
        this.ops = groupOps(this.ops);
        this.appliedOps = [];
    }

    applyOp(op) {
        this.insertBlock(op.idx, op.node, op.method);
    }

    insertBlock(idx, node, method) {
        if (method === 'insert') {
          var tr = this.view.state.tr[method](idx, node);
        } else if (method === 'replace') {
          var tr = this.view.state.tr[method](idx, idx, node);
        }
        
        tr.scrollIntoView();
        var newState = this.view.state.apply(tr);
        this.view.updateState(newState);
    }

    undo() {
        var opSet = this.appliedOps.pop();
        this.ops.unshift(opSet);
        // cannot use the below `undo` method provided by prosemirror it because it somehow composes adjacent ops together.
        // this means one undo can combine last two ops of 5 chars each & delete 10 characters.
        // It'd be diffcult for me to find out how many ops were combined together for the undo operation.
        // undo(this.view.state, this.view.dispatch);

        // Hence, the simpler method as follows.
        // TODO: there has to be a better way to do undo.
        var op = opSet[0];
        var tr = this.view.state.tr.delete(op.idx, this.view.state.doc.content.size);
        tr.scrollIntoView();
        var newState = this.view.state.apply(tr);
        this.view.updateState(newState);
        // opSet.forEach(op => {
        //     var tr = this.view.state.tr.delete(op.idx, this.view.state.doc.content.size);
        //     var newState = this.view.state.apply(tr);
        //     this.view.updateState(newState);
        // }, this)
    }

    next() {
        let opSet = this.ops.shift();
        opSet.forEach(op => {
            this.applyOp(op);
        }, this)
        this.appliedOps.push(opSet);
    }

    prev() {
        this.undo();
    }

    hasNext() {
        return this.ops.length;
    }

    hasPrev() {
        return this.appliedOps.length;
    }
}

export {
    PostPlayer,
    getEmptyDocJSON
}