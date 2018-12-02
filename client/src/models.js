import $ from 'jquery';

var session = {};

var loadSession = function() {
    return $.get('/session/get').done((resp) => {
        session.session_key = resp.session_key;
        session.user = resp.user;
    })
}

window.session = session;

export default {
    session,
    loadSession
};