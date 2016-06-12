(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var BoardElement = (function () {
        function BoardElement(id, mergedId, value) {
            this._id = id;
            this._mergedId = mergedId;
            this._value = value;
        }
        Object.defineProperty(BoardElement.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoardElement.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoardElement.prototype, "mergedId", {
            get: function () {
                return this._mergedId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoardElement.prototype, "isEmpty", {
            get: function () {
                return this._value === 0;
            },
            enumerable: true,
            configurable: true
        });
        BoardElement.prototype.canMerge = function (other) {
            return this._value === other._value;
        };
        BoardElement.prototype.merge = function (other) {
            return new BoardElement(this._id, other._id, this._value + other._value);
        };
        BoardElement.EMPTY = new BoardElement(0, 0, 0);
        return BoardElement;
    }());
    exports.BoardElement = BoardElement;
});
//# sourceMappingURL=boardElement.js.map