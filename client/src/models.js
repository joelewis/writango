import $ from 'jquery';

var session = {};

var loadSession = function() {
    return $.Deferred().resolve;
}

export default {
    session,
    loadSession
};