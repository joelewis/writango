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
    })
}

model.loadPosts = function(userkey) {
    return $.get('/posts/@'+userkey).done(resp => {
        model.posts = resp.posts;
    })
};


model.loadDrafts = function() {
    return $.get('/drafts').done(resp => {
        model.drafts = resp.drafts;
    })
};

window.model = model;

export default model;