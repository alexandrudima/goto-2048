(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './boardElement', './boardCell'], factory);
    }
})(function (require, exports) {
    "use strict";
    var boardElement_1 = require('./boardElement');
    var boardCell_1 = require('./boardCell');
    var Board = (function () {
        function Board(boardSize) {
            this._boardSize = boardSize;
            this._elements = [];
            for (var row = 0; row < boardSize; row++) {
                this._elements[row] = [];
                for (var col = 0; col < boardSize; col++) {
                    this._elements[row][col] = boardElement_1.BoardElement.EMPTY;
                }
            }
        }
        Board.prototype.set = function (row, column, value) {
            this._elements[row][column] = value;
        };
        Board.prototype.get = function (row, column) {
            return this._elements[row][column];
        };
        /**
         * Create a new element randomly (a 2 or a 4)
         */
        Board.prototype.spawn = function (id) {
            var emptySlots = [];
            for (var row_1 = 0; row_1 < this._boardSize; row_1++) {
                for (var col_1 = 0; col_1 < this._boardSize; col_1++) {
                    if (this._elements[row_1][col_1].isEmpty) {
                        emptySlots.push(row_1 * this._boardSize + col_1);
                    }
                }
            }
            if (emptySlots.length === 0) {
                return;
            }
            var pickedSlot = emptySlots[Board.getRandomInt(0, emptySlots.length)];
            var row = Math.floor(pickedSlot / this._boardSize);
            var col = pickedSlot % this._boardSize;
            var pickedValue = Board.getRandomInt(1, 3) * 2;
            this.set(row, col, new boardElement_1.BoardElement(id, 0, pickedValue));
        };
        Board.deserialize = function (data) {
            var size = data.length;
            var r = new Board(size);
            for (var row = 0; row < size; row++) {
                for (var col = 0; col < size; col++) {
                    var el = data[row][col];
                    r.set(row, col, new boardElement_1.BoardElement(el.id, el.mergedId, el.value));
                }
            }
            return r;
        };
        Board.prototype.serialize = function () {
            var r = [];
            for (var row = 0; row < this._boardSize; row++) {
                r[row] = [];
                for (var col = 0; col < this._boardSize; col++) {
                    var el = this._elements[row][col];
                    r[row][col] = {
                        id: el.id,
                        mergedId: el.mergedId,
                        value: el.value
                    };
                }
            }
            return r;
        };
        Board.prototype.getCells = function () {
            var r = [];
            for (var row = 0; row < this._boardSize; row++) {
                for (var col = 0; col < this._boardSize; col++) {
                    var el = this._elements[row][col];
                    if (!el.isEmpty) {
                        r.push(new boardCell_1.BoardCell(el.id, row, col, el.value));
                        if (el.mergedId) {
                            r.push(new boardCell_1.BoardCell(el.mergedId, row, col, 0));
                        }
                    }
                }
            }
            return r;
        };
        Board.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        };
        Board.prototype.hasEmptyElement = function () {
            for (var row = 0; row < this._boardSize; row++) {
                for (var col = 0; col < this._boardSize; col++) {
                    if (this._elements[row][col].isEmpty) {
                        return true;
                    }
                }
            }
            return false;
        };
        Board.prototype.isMergeable = function () {
            for (var row = 0; row < this._boardSize; row++) {
                for (var col = 0; col < this._boardSize; col++) {
                    var myValue = this._elements[row][col].value;
                    if (myValue === 0) {
                        return true;
                    }
                    var aboveValue = row > 0 ? this._elements[row - 1][col].value : -1;
                    var belowValue = row + 1 < this._boardSize ? this._elements[row + 1][col].value : 1;
                    var leftValue = col > 0 ? this._elements[row][col - 1].value : -1;
                    var rightValue = col + 1 < this._boardSize ? this._elements[row][col + 1].value : 1;
                    if (myValue === aboveValue || myValue === belowValue || myValue === leftValue || myValue === rightValue) {
                        return true;
                    }
                }
            }
            return false;
        };
        return Board;
    }());
    exports.Board = Board;
});
//# sourceMappingURL=board.js.map