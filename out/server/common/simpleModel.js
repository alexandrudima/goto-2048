(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './boardElement', './board'], factory);
    }
})(function (require, exports) {
    "use strict";
    var boardElement_1 = require('./boardElement');
    var board_1 = require('./board');
    var SimpleModel = (function () {
        function SimpleModel(boardSize) {
            this._boardSize = boardSize;
            this._listeners = [];
            this._lastElementId = 0;
            this._setBoard(new board_1.Board(this._boardSize));
        }
        SimpleModel.prototype.addListener = function (listener) {
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i] === listener) {
                    // Don't add the same listener twice
                    return;
                }
            }
            this._listeners.push(listener);
            listener.onChanged(this);
        };
        SimpleModel.prototype.removeListener = function (listener) {
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i] === listener) {
                    this._listeners.splice(i, 1);
                    return;
                }
            }
        };
        SimpleModel.prototype.serialize = function () {
            return this._board.serialize();
        };
        SimpleModel.prototype.getCells = function () {
            return this._board.getCells();
        };
        Object.defineProperty(SimpleModel.prototype, "isFinished", {
            get: function () {
                return !this._board.hasEmptyElement() && !this._board.isMergeable();
            },
            enumerable: true,
            configurable: true
        });
        SimpleModel.prototype.reset = function () {
            this._setBoard(new board_1.Board(this._boardSize));
        };
        SimpleModel.prototype.up = function () {
            var newBoard = new board_1.Board(this._boardSize);
            for (var col = 0; col < this._boardSize; col++) {
                var rows = SimpleModel._mergeValues(this._extractNonZeroRows(col, false));
                for (var row = 0; row < rows.length; row++) {
                    newBoard.set(row, col, rows[row]);
                }
            }
            this._setBoard(newBoard);
        };
        SimpleModel.prototype.down = function () {
            var newBoard = new board_1.Board(this._boardSize);
            for (var col = 0; col < this._boardSize; col++) {
                var rows = SimpleModel._mergeValues(this._extractNonZeroRows(col, true));
                for (var row = 0; row < rows.length; row++) {
                    newBoard.set(this._boardSize - row - 1, col, rows[row]);
                }
            }
            this._setBoard(newBoard);
        };
        SimpleModel.prototype.left = function () {
            var newBoard = new board_1.Board(this._boardSize);
            for (var row = 0; row < this._boardSize; row++) {
                var columns = SimpleModel._mergeValues(this._extractNonZeroColumns(row, false));
                for (var col = 0; col < columns.length; col++) {
                    newBoard.set(row, col, columns[col]);
                }
            }
            this._setBoard(newBoard);
        };
        SimpleModel.prototype.right = function () {
            var newBoard = new board_1.Board(this._boardSize);
            for (var row = 0; row < this._boardSize; row++) {
                var columns = SimpleModel._mergeValues(this._extractNonZeroColumns(row, true));
                for (var col = 0; col < columns.length; col++) {
                    newBoard.set(row, this._boardSize - col - 1, columns[col]);
                }
            }
            this._setBoard(newBoard);
        };
        SimpleModel.prototype._setBoard = function (newBoard) {
            newBoard.spawn(++this._lastElementId);
            this._board = newBoard;
            var listeners = this._listeners.slice(0);
            for (var i = 0; i < listeners.length; i++) {
                listeners[i].onChanged(this);
            }
        };
        SimpleModel.prototype._extractNonZeroRows = function (col, reverse) {
            var values = [];
            for (var row = 0; row < this._boardSize; row++) {
                var el = this._board.get(row, col);
                if (!el.isEmpty) {
                    values.push(el);
                }
            }
            if (reverse) {
                values.reverse();
            }
            return values;
        };
        SimpleModel.prototype._extractNonZeroColumns = function (row, reverse) {
            var values = [];
            for (var col = 0; col < this._boardSize; col++) {
                var el = this._board.get(row, col);
                if (!el.isEmpty) {
                    values.push(el);
                }
            }
            if (reverse) {
                values.reverse();
            }
            return values;
        };
        SimpleModel._mergeValues = function (values) {
            var r = [];
            var previous = boardElement_1.BoardElement.EMPTY;
            for (var i = 0; i < values.length; i++) {
                if (previous.isEmpty) {
                    previous = values[i];
                }
                else if (previous.canMerge(values[i])) {
                    r.push(previous.merge(values[i]));
                    previous = boardElement_1.BoardElement.EMPTY;
                }
                else {
                    r.push(previous);
                    previous = values[i];
                }
            }
            if (!previous.isEmpty) {
                r.push(previous);
            }
            return r;
        };
        return SimpleModel;
    }());
    exports.SimpleModel = SimpleModel;
});
