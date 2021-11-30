export class Point {
    constructor(public x: number, public y: number) {

    }

    public static delta(final: Point, initial: Point) {
        return new Point(final.x - initial.x, final.y - initial.y);
    }
}

export class Movable {

    start: Point = { x: 0, y: 0 };
    current: Point = { x: 0, y: 0 };
    isDragging: boolean = false;

    constructor(public onChange: (delta: Point) => void) {

    }

    public onMouseDown(e: MouseEvent) {
        this._onStartDrag({ x: e.clientX, y: e.clientY });
    }

    public onTouchStart(e: TouchEvent) {
        const touch = e.touches.item(0);
        if (touch) {
            this._onStartDrag({ x: touch.clientX, y: touch.clientY });
        }
    }

    private _onMouseMove(e: MouseEvent) {
        this._onDrag({ x: e.clientX, y: e.clientY });
    }

    private _onTouchMove(e: TouchEvent) {
        const touch = e.touches.item(0);
        if (touch) {
            this._onDrag({ x: touch.clientX, y: touch.clientY });
        }
    }

    private _onMouseUp(e: MouseEvent) {
        this._onEndDrag({ x: e.clientX, y: e.clientY });
    }

    private _onTouchEnd(e: TouchEvent) {
        const touch = e.touches.item(0);
        if (touch) {
            this._onEndDrag({ x: touch.clientX, y: touch.clientY });
        }
    }

    private _onStartDrag(point: Point) {

        this.isDragging = true;
        this.start = point;
        this.current = point;

        document.addEventListener('mousemove', this._onMouseMove.bind(this));
        document.addEventListener('mouseup', this._onMouseUp.bind(this));
        document.addEventListener('touchmove', this._onTouchMove.bind(this));
        document.addEventListener('touchend', this._onTouchEnd.bind(this));

        this.__clearSelection();
    }

    private _onDrag(point: Point) {
        if (this.isDragging) {

            this.onChange(Point.delta(point, this.current));

            this.current = point;
            this.__clearSelection();
        }
    }

    private _onEndDrag(point: Point) {
        this.isDragging = false;

        document.removeEventListener('mousemove', this._onMouseMove);
        document.removeEventListener('mouseup', this._onMouseUp);
        document.removeEventListener('touchmove', this._onTouchMove);
        document.removeEventListener('touchend', this._onTouchEnd);

    }

    private __clearSelection() {
        if (window.getSelection) {
            if (window.getSelection()?.empty) {  // Chrome
                window.getSelection()?.empty();
            } else if (window.getSelection()?.removeAllRanges) {  // Firefox
                window.getSelection()?.removeAllRanges();
            }
        }
        // } else if (document.selection) {  // IE?
        //     document.selection.empty();
        // }
    }
}


export class Draggable {

    constructor(public getHTMLDivElement: () => HTMLDivElement | null) {

    }

    public onDragStart(e: DragEvent, data?: (e: DragEvent) => string) {

        const draggedItem = this.getHTMLDivElement()
        if (draggedItem && e.dataTransfer) {
            const rect = draggedItem.getBoundingClientRect();
            const offset = Point.delta({ x: e.clientX, y: e.clientY }, { x: rect.x, y: rect.y });
            e.dataTransfer.setDragImage(draggedItem, offset.x, offset.y);

            const customClass = Date.now().toString();
            e.dataTransfer.setData('dragdrop-content', customClass);
            e.dataTransfer.setData('custom-data', data ? data(e) : '');
            draggedItem.classList.add(customClass);
        }
    }
}

export class Droppable {


    constructor(public getHTMLDivElement: () => HTMLDivElement | null) {

    }

    public onDragOver(e: DragEvent, canDrop: (e: DragEvent, data: string) => boolean) {
        const data = e.dataTransfer?.getData('customer-data') ?? '';
        if (canDrop(e, data)) e.preventDefault();
    }

    public onDrop(e: DragEvent) {

        const dropTarget = this.getHTMLDivElement();
        if (dropTarget) {
            const className = e.dataTransfer?.getData('dragdrop-content') as string;
            const element = document.getElementsByClassName(className).item(0);
            if (element) {
                element.classList.remove(className);
                dropTarget.appendChild(element);
            } else {
            }
        }
    }

}
