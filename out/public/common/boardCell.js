(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var BoardCell = (function () {
        function BoardCell(id, row, col, value) {
            this._id = id;
            this._row = row;
            this._col = col;
            this._value = value;
        }
        Object.defineProperty(BoardCell.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoardCell.prototype, "row", {
            get: function () {
                return this._row;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoardCell.prototype, "col", {
            get: function () {
                return this._col;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoardCell.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        return BoardCell;
    }());
    exports.BoardCell = BoardCell;
});
