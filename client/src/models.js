import $ from 'jquery';
import {newPostJSON} from "./editor/placeholders.js"
/**
 * Client DB
 * Holds the information necessary for components
 * TODO: Use a proper state management library
 */
var model = {
    session: {},
    posts: [],
    drafts: [],
    currentDoc: {}
};

model.loadSession = function() {
    return $.get('/session/get').done((resp) => {
        model.session.session_key = resp.session_key;
        model.session.user = resp.user;
    });
}

model.loadPosts = function(userkey, page) {
    return $.get('/posts/'+userkey+'?page='+page).done(resp => {
        model.posts = resp.posts;
    });
};

model.loadPost = function(userkey, slug) {
    return $.get('/posts/'+userkey+'/'+slug).done(resp => {
        if (resp && resp.fields && resp.fields.text) {
            resp.fields.text = JSON.parse(resp.fields.text);
        }
        model.currentDoc = resp;
    });
};

model.editDraft = function(userkey, slug, postJSON) {
    // postJSON.fields.text = postJSON.fields.text ? JSON.stringify(postJSON.fields.text) : postJSON.fields.text;
    postJSON.fields.text = postJSON.fields.text || newPostJSON();
    return $.ajax({
        url: '/drafts/'+userkey+'/edit/'+slug, 
        method: 'POST',
        data: JSON.stringify(postJSON),
        dataType: 'json',
        contentType: "application/json"
    });

};

model.loadDrafts = function(userkey, page) {
    return $.get('/drafts/'+userkey+'?page='+page).done(resp => {
        model.drafts = resp.posts;
        return resp;
    });
};

model.createDraft = function() {
    return $.get('/create/draft');
};

model.deletePost = function(id) {
    return $.get('/posts/'+id+'/delete').done(resp => {
        console.log(resp);
    })
}

model.publishDraft = function(id) {
    return $.get('/drafts/'+id+'/publish').done(resp => {
        console.log(resp);
    })
}

model.loginUser = (email, password) => {
    return $.post('/login/', {email: email, password: password});
}

model.registerUser = (email, password) => {
    return $.post('/register/', {email: email, password: password});
}

window.model = model;

export default model;