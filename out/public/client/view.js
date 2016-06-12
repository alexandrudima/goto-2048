(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../lib/css!./view"], factory);
    }
})(function (require, exports) {
    "use strict";
    require("../lib/css!./view");
    function pos(i) {
        return ViewCell.CELL_PADDING + i * (ViewCell.CELL_INNER_SIZE + ViewCell.CELL_PADDING);
    }
    var ViewCell = (function () {
        function ViewCell(id, row, col, value) {
            this._id = id;
            this._domNode = document.createElement('div');
            this._domNode.className = 'view-cell';
            this.update(row, col, value);
        }
        Object.defineProperty(ViewCell.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewCell.prototype, "domNode", {
            get: function () {
                return this._domNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewCell.prototype, "isAlive", {
            get: function () {
                return this._isAlive;
            },
            enumerable: true,
            configurable: true
        });
        ViewCell.prototype.onBeforeUpdate = function () {
            this._isAlive = false;
        };
        ViewCell.prototype.update = function (row, col, value) {
            var _this = this;
            this._isAlive = true;
            this._domNode.style.left = ViewCell.CELL_PADDING + col * (ViewCell.CELL_INNER_SIZE + ViewCell.CELL_PADDING) + 'px';
            this._domNode.style.top = ViewCell.CELL_PADDING + row * (ViewCell.CELL_INNER_SIZE + ViewCell.CELL_PADDING) + 'px';
            var prevContent = this._domNode.innerHTML;
            var content = value ? String(value) : '';
            var className = value ? ('view-cell v' + value) : 'view-cell';
            if (!prevContent) {
                className += ' new';
            }
            this._domNode.className = className;
            if (prevContent && content && prevContent != content) {
                className += ' bang';
                setTimeout(function () {
                    _this._domNode.className = className;
                }, 0);
            }
            this._domNode.innerHTML = content;
        };
        ViewCell.CELL_INNER_SIZE = 80;
        ViewCell.CELL_PADDING = 15;
        return ViewCell;
    }());
    var View = (function () {
        function View(domNode, model) {
            var _this = this;
            this._domNode = document.createElement('div');
            this._domNode.className = 'game-board';
            this._model = model;
            this._cells = {};
            this._setup();
            this._model.addListener(this);
            var resetBtn = document.createElement('button');
            resetBtn.className = 'game-button';
            resetBtn.appendChild(document.createTextNode("Reset"));
            domNode.appendChild(resetBtn);
            resetBtn.onclick = function () {
                _this._model.reset();
            };
            var br = document.createElement('br');
            br.className = ".clear";
            domNode.appendChild(br);
            domNode.appendChild(this._domNode);
        }
        View.prototype._setup = function () {
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++) {
                    var div = document.createElement('div');
                    div.className = 'background-cell';
                    div.style.top = pos(row) + 'px';
                    div.style.left = pos(col) + 'px';
                    this._domNode.appendChild(div);
                }
            }
        };
        View.prototype.onChanged = function (model) {
            for (var id in this._cells) {
                this._cells[id].onBeforeUpdate();
            }
            var cells = model.getCells();
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                if (this._cells[String(cell.id)]) {
                    var myCell = this._cells[String(cell.id)];
                    myCell.update(cell.row, cell.col, cell.value);
                }
                else {
                    var myCell = new ViewCell(cell.id, cell.row, cell.col, cell.value);
                    this._cells[String(myCell.id)] = myCell;
                    this._domNode.appendChild(myCell.domNode);
                }
            }
            for (var id in this._cells) {
                var myCell = this._cells[id];
                if (!myCell.isAlive) {
                    myCell.domNode.parentElement.removeChild(myCell.domNode);
                    delete this._cells[id];
                }
            }
        };
        return View;
    }());
    exports.View = View;
});
//# sourceMappingURL=view.js.map