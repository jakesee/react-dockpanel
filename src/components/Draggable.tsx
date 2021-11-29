import { DesktopMacOutlined } from "@mui/icons-material";

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

    constructor(public getHTMLDivElement: () => HTMLDivElement | null) {

    }

    public onMouseDown(e: MouseEvent) {
        this._onStartDrag(e.target, { x: e.clientX, y: e.clientY });
    }

    public onTouchStart(e: TouchEvent) {
        const touch = e.touches.item(0);
        if (touch) {
            this._onStartDrag(e.target, { x: touch.clientX, y: touch.clientY });
        }
    }

    public onMouseUp(e: MouseEvent) {
        this._onEndDrag(e.target, { x: e.clientX, y: e.clientY });
    }

    public onTouchEnd(e: TouchEvent) {
        const touch = e.touches.item(0);
        if (touch) {
            this._onEndDrag(e.target, { x: touch.clientX, y: touch.clientY });
        }
    }

    public onMouseMove(e: MouseEvent) {
        this._onDrag(e.target, { x: e.clientX, y: e.clientY });
    }

    public onTouchMove(e: TouchEvent) {
        const touch = e.touches.item(0);
        if (touch) {
            this._onDrag(e.target, { x: touch.clientX, y: touch.clientY });
        }
    }

    private _onStartDrag(target: EventTarget | null, point: Point) {
        if (target) {
            this.isDragging = true;
            this.start = point;
            this.current = point;
        }
    }

    private _onDrag(target: EventTarget | null, point: Point) {
        if (target && this.isDragging) {

            this._moveElement(Point.delta(point, this.current));
            this.current = point;
        }
    }

    private _onEndDrag(target: EventTarget | null, point: Point) {
        this.isDragging = false;

    }

    private _moveElement(delta: Point) {
        const element = this.getHTMLDivElement();
        if (element) {

            const rect = element.getBoundingClientRect();

            const x = rect.left + delta.x;
            const y = rect.top + delta.y;

            element.style.position = 'absolute';
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        }
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
                console.log(className);
                element.classList.remove(className);
                dropTarget.appendChild(element);
            } else {
                console.log('byebye');
            }
        }
    }

}
