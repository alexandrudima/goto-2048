
import "../lib/css!./view";
import {IModel, IModelListener} from '../common/int';
import {BoardCell} from '../common/boardCell';

function pos(i: number): number {
	return ViewCell.CELL_PADDING + i * (ViewCell.CELL_INNER_SIZE + ViewCell.CELL_PADDING);
}

class ViewCell {
	public static CELL_INNER_SIZE = 80;
	public static CELL_PADDING = 15;

	private _id: number;
	private _domNode: HTMLElement;
	private _isAlive: boolean;

	constructor(id: number, row: number, col: number, value: number) {
		this._id = id;
		this._domNode = document.createElement('div');
		this._domNode.className = 'view-cell';
		this.update(row, col, value);
	}

	public get id(): number {
		return this._id;
	}

	public get domNode(): HTMLElement {
		return this._domNode;
	}

	public get isAlive(): boolean {
		return this._isAlive;
	}

	public onBeforeUpdate(): void {
		this._isAlive = false;
	}

	public update(row: number, col: number, value: number): void {
		this._isAlive = true;

		this._domNode.style.left = ViewCell.CELL_PADDING + col * (ViewCell.CELL_INNER_SIZE + ViewCell.CELL_PADDING) + 'px';
		this._domNode.style.top = ViewCell.CELL_PADDING + row * (ViewCell.CELL_INNER_SIZE + ViewCell.CELL_PADDING) + 'px';

		let prevContent = this._domNode.innerHTML;
		let content = value ? String(value) : '';

		let className = value ? ('view-cell v' + value) : 'view-cell';
		if (!prevContent) {
			className += ' new';
		}

		this._domNode.className = className;
		if (prevContent && content && prevContent != content) {
			className += ' bang';
			setTimeout(() => {
				this._domNode.className = className;
			}, 0);
		}

		this._domNode.innerHTML = content;
	}
}

export class View implements IModelListener {

	private _domNode: HTMLElement;
	private _model: IModel;
	private _cells: {
		[id: string]: ViewCell;
	};

	constructor(domNode: HTMLElement, model: IModel) {
		this._domNode = document.createElement('div');
		this._domNode.className = 'game-board';
		this._model = model;
		this._cells = {};
		this._setup();
		this._model.addListener(this);

		let resetBtn = document.createElement('button');
		resetBtn.className = 'game-button';
		resetBtn.appendChild(document.createTextNode("Reset"));
		domNode.appendChild(resetBtn);
		resetBtn.onclick = () => {
			this._model.reset();
		};

		let br = document.createElement('br');
		br.className = ".clear";
		domNode.appendChild(br);

		domNode.appendChild(this._domNode);
	}

	private _setup(): void {
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				let div = document.createElement('div');
				div.className = 'background-cell';
				div.style.top = pos(row) + 'px';
				div.style.left = pos(col) + 'px';
				this._domNode.appendChild(div);
			}
		}
	}

	public onChanged(model: IModel): void {

		for (let id in this._cells) {
			this._cells[id].onBeforeUpdate();
		}

		let cells = model.getCells();

		for (let i = 0; i < cells.length; i++) {
			let cell = cells[i];
			if (this._cells[String(cell.id)]) {
				let myCell = this._cells[String(cell.id)];
				myCell.update(cell.row, cell.col, cell.value);
			} else {
				let myCell = new ViewCell(cell.id, cell.row, cell.col, cell.value);
				this._cells[String(myCell.id)] = myCell;
				this._domNode.appendChild(myCell.domNode);
			}
		}

		for (let id in this._cells) {
			let myCell = this._cells[id];
			if (!myCell.isAlive) {
				myCell.domNode.parentElement.removeChild(myCell.domNode);
				delete this._cells[id];
			}
		}
	}
}
