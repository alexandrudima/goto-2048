(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../common/int', '../common/board'], factory);
    }
})(function (require, exports) {
    "use strict";
    var int_1 = require('../common/int');
    var board_1 = require('../common/board');
    var RemoteModel = (function () {
        function RemoteModel(socket, gameId) {
            var _this = this;
            this._socket = socket;
            this._gameId = gameId;
            socket.on('message', function (data) { return _this._onMessage(data); });
            this._sendEvent({
                type: int_1.ClientEventType.Init,
                data: gameId
            });
            this._listeners = [];
            this._board = new board_1.Board(4);
        }
        RemoteModel.prototype._sendEvent = function (event) {
            this._socket.emit('message', event);
        };
        RemoteModel.prototype.addListener = function (listener) {
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i] === listener) {
                    // Don't add the same listener twice
                    return;
                }
            }
            this._listeners.push(listener);
            listener.onChanged(this);
        };
        RemoteModel.prototype.removeListener = function (listener) {
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i] === listener) {
                    this._listeners.splice(i, 1);
                    return;
                }
            }
        };
        RemoteModel.prototype._onMessage = function (data) {
            switch (data.type) {
                case int_1.ServerEventType.ModelChanged:
                    this._onServerModelChanged(data.data);
                    break;
            }
        };
        RemoteModel.prototype._onServerModelChanged = function (data) {
            this._board = board_1.Board.deserialize(data);
            var listeners = this._listeners.slice(0);
            for (var i = 0; i < listeners.length; i++) {
                listeners[i].onChanged(this);
            }
        };
        Object.defineProperty(RemoteModel.prototype, "isFinished", {
            get: function () {
                return !this._board.hasEmptyElement() && !this._board.isMergeable();
            },
            enumerable: true,
            configurable: true
        });
        RemoteModel.prototype.getCells = function () {
            return this._board.getCells();
        };
        RemoteModel.prototype.reset = function () {
            this._sendEvent({
                type: int_1.ClientEventType.Reset,
                data: this._gameId
            });
        };
        RemoteModel.prototype.up = function () {
            this._sendEvent({
                type: int_1.ClientEventType.Up,
                data: this._gameId
            });
        };
        RemoteModel.prototype.down = function () {
            this._sendEvent({
                type: int_1.ClientEventType.Down,
                data: this._gameId
            });
        };
        RemoteModel.prototype.left = function () {
            this._sendEvent({
                type: int_1.ClientEventType.Left,
                data: this._gameId
            });
        };
        RemoteModel.prototype.right = function () {
            this._sendEvent({
                type: int_1.ClientEventType.Right,
                data: this._gameId
            });
        };
        return RemoteModel;
    }());
    exports.RemoteModel = RemoteModel;
});
