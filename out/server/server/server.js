(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'express', 'http', 'socket.io', 'path', '../common/simpleModel', '../common/int'], factory);
    }
})(function (require, exports) {
    "use strict";
    var express = require('express');
    var http = require('http');
    var sio = require('socket.io');
    var path = require('path');
    var simpleModel_1 = require('../common/simpleModel');
    var int_1 = require('../common/int');
    var app = express();
    app.use(express.static(path.join(__dirname, '../../public')));
    var server = http.createServer(app);
    var io = sio.listen(server);
    server.listen(process.env.PORT || 8000);
    var modelsMap = {};
    io.sockets.on('connection', function (socket) {
        var send = function (event) {
            socket.send(event);
        };
        var model = null;
        var modelListener = {
            onChanged: function (model) {
                send({
                    type: int_1.ServerEventType.ModelChanged,
                    data: model.serialize()
                });
            }
        };
        function getOrCreateModel(gameId) {
            var r = modelsMap[gameId];
            if (!r) {
                r = new simpleModel_1.SimpleModel(4);
                modelsMap[gameId] = r;
            }
            return r;
        }
        function init(gameId) {
            if (model) {
                model.removeListener(modelListener);
                model = null;
            }
            model = getOrCreateModel(gameId);
            model.addListener(modelListener);
        }
        function reset(gameId) {
            model = getOrCreateModel(gameId);
            model.reset();
        }
        function up(gameId) {
            getOrCreateModel(gameId).up();
        }
        function down(gameId) {
            getOrCreateModel(gameId).down();
        }
        function left(gameId) {
            getOrCreateModel(gameId).left();
        }
        function right(gameId) {
            getOrCreateModel(gameId).right();
        }
        console.log('server got connection');
        socket.on('message', function (msg) {
            switch (msg.type) {
                case int_1.ClientEventType.Init:
                    init(msg.data);
                    break;
                case int_1.ClientEventType.Reset:
                    reset(msg.data);
                    break;
                case int_1.ClientEventType.Up:
                    up(msg.data);
                    break;
                case int_1.ClientEventType.Down:
                    down(msg.data);
                    break;
                case int_1.ClientEventType.Left:
                    left(msg.data);
                    break;
                case int_1.ClientEventType.Right:
                    right(msg.data);
                    break;
            }
        });
        socket.on('disconnect', function () {
            if (model) {
                model.removeListener(modelListener);
                model = null;
            }
        });
    });
});
