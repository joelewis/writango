import $ from 'jquery';
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

model.loadPosts = function(userkey) {
    return $.get('/posts/'+userkey).done(resp => {
        model.posts = resp.posts;
    });
};

model.loadPost = function(userkey, slug) {
    return $.get('/posts/'+userkey+'/'+slug).done(resp => {
        model.currentDoc = resp;
    });
};

model.editDraft = function(userkey, slug, postJSON) {
    // postJSON.fields.text = postJSON.fields.text ? JSON.stringify(postJSON.fields.text) : postJSON.fields.text;
    return $.ajax({
        url: '/drafts/'+userkey+'/edit/'+slug, 
        method: 'POST',
        data: JSON.stringify(postJSON),
        dataType: 'json',
        contentType: "application/json"
    });

};

model.loadDrafts = function(userkey) {
    return $.get('/drafts/'+userkey).done(resp => {
        model.drafts = resp.posts;
    });
};

model.createDraft = function() {
    return $.get('/create/draft');
};



window.model = model;

export default model;