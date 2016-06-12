(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../common/simpleModel', './remoteModel', './view'], factory);
    }
})(function (require, exports) {
    "use strict";
    var simpleModel_1 = require('../common/simpleModel');
    var remoteModel_1 = require('./remoteModel');
    var view_1 = require('./view');
    var createdModels = [];
    var up = function () { return createdModels.forEach(function (m) { return m.up(); }); };
    var right = function () { return createdModels.forEach(function (m) { return m.right(); }); };
    var down = function () { return createdModels.forEach(function (m) { return m.down(); }); };
    var left = function () { return createdModels.forEach(function (m) { return m.left(); }); };
    document.addEventListener('keydown', function (e) {
        var LEFT_ARROW = 37;
        var UP_ARROW = 38;
        var RIGHT_ARROW = 39;
        var DOWN_ARROW = 40;
        if (e.keyCode === LEFT_ARROW) {
            left();
            e.preventDefault();
        }
        else if (e.keyCode === UP_ARROW) {
            up();
            e.preventDefault();
        }
        else if (e.keyCode === RIGHT_ARROW) {
            right();
            e.preventDefault();
        }
        else if (e.keyCode === DOWN_ARROW) {
            down();
            e.preventDefault();
        }
    });
    $("body").swipe({
        //Generic swipe handler for all directions
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (direction === 'left') {
                left();
            }
            else if (direction === 'up') {
                up();
            }
            else if (direction === 'right') {
                right();
            }
            else if (direction === 'down') {
                down();
            }
        }
    });
    function create(domNode) {
        console.log('create!');
        var model = new simpleModel_1.SimpleModel(4);
        createdModels.push(model);
        var v = new view_1.View(domNode, model);
    }
    exports.create = create;
    function createMultiplayer(domNode, io) {
        console.log('createMultiplayer!');
        if (location.hash === '') {
            // Generate a new hash
            var guid = (function () {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                }
                return function () {
                    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
                };
            })();
            location.hash = guid();
        }
        var gameId = location.hash;
        var socket = io.connect(location.origin);
        var model = new remoteModel_1.RemoteModel(socket, gameId);
        createdModels.push(model);
        var v = new view_1.View(domNode, model);
    }
    exports.createMultiplayer = createMultiplayer;
});
