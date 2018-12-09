var prosemirrorKeymap = require('prosemirror-keymap');
var prosemirrorHistory = require('prosemirror-history');
var prosemirrorCommands = require('prosemirror-commands');
var prosemirrorState = require('prosemirror-state');
var prosemirrorDropcursor = require('prosemirror-dropcursor');
var prosemirrorGapcursor = require('prosemirror-gapcursor');
var prosemirrorMenu = require('prosemirror-menu');
var prosemirrorSchemaList = require('prosemirror-schema-list');
var prosemirrorInputrules = require('prosemirror-inputrules');

var basicSetup = require('prosemirror-example-setup');
buildMenuItems = basicSetup.buildMenuItems;
buildKeymap = basicSetup.buildKeymap;
buildInputRules = basicSetup.buildInputRules;


var getPlugins = function(options) {
    var plugins = [
        buildInputRules(options.schema),
        prosemirrorKeymap.keymap(buildKeymap(options.schema, options.mapKeys)),
        prosemirrorKeymap.keymap(prosemirrorCommands.baseKeymap),
        prosemirrorDropcursor.dropCursor(),
        prosemirrorGapcursor.gapCursor()
    ];
    // if (options.menuBar !== false) { 
    // plugins.push(prosemirrorMenu.menuBar({
    //     floating: true,
    //     content: buildMenuItems(options.schema).fullMenu.map(function(menuBlocks) { // ma & filter to remove unneeded menu items
    //          return menuBlocks.filter(function(menu) {
    //              return menu !== prosemirrorMenu.selectParentNodeItem;
    //          });
    //     })
    // })); 
    // }
    if (options.history !== false) { 
        plugins.push(prosemirrorHistory.history()); 
    }

    return plugins.concat(new prosemirrorState.Plugin({
        props: {
            attributes: {class: "ProseMirror-example-setup-style"}
        }
    }))
}

exports.getPlugins = getPlugins;