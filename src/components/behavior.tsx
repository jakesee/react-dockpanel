import { ReactNode } from "react";

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


export class DragDropable {

    public onDragStart(e: DragEvent, sourceData: string) {
        e.dataTransfer?.setData('source-data', sourceData);
    }

    public onDragOver(e: DragEvent, canDrop: (e: DragEvent, data: string) => boolean) {
        const data = e.dataTransfer?.getData('source-data') ?? '';
        if (canDrop(e, data)) e.preventDefault();
    }

    public onDrop(e: DragEvent, action: (sourceData: string) => void) {
        const data = e.dataTransfer?.getData('source-data');
        data && action && action(data);
    }
}

export class CDockForm {
    constructor(public id: string,
        public title: string,
        public children?: ReactNode,
        public icon?: ReactNode) {
    }
}

export enum DockLayoutDirection {
    Horizontal,
    Vertical
}


export enum DockLayoutItemType {
    Splitter, Panel
}

enum DockLayoutSide {
    Primary, Secondary
}

export class CDockLayoutItem {
    constructor(public id: string, public type: DockLayoutItemType) { }
}


export class CDockSplitter extends CDockLayoutItem {
    constructor(
        public id: string,
        public primary: CDockLayoutItem,
        public secondary: CDockLayoutItem,
        public direction: DockLayoutDirection = DockLayoutDirection.Horizontal,
        public size: number = 200
    ) {
        super(id, DockLayoutItemType.Splitter);
    }
}

export class CDockPanel extends CDockLayoutItem {
    constructor(public id: string,
        public forms: CDockForm[]) {
        super(id, DockLayoutItemType.Panel);
    }
}

export class CDockManager {

    public static clone(layout: CDockLayoutItem) {
        console.log(JSON.stringify(layout));
        return JSON.parse('{}');
    }

    public static createForm(title: string, children?: ReactNode, icon?: ReactNode) {
        const form = new CDockForm(this._hash('dmf'), title, children, icon)
        return form;
    }

    public static createPanel(forms: CDockForm[]) {
        const panel = new CDockPanel(this._hash('dmp'), forms);
        return panel;
    }

    public static createSplitter(primary: CDockLayoutItem, secondary: CDockLayoutItem, direction: DockLayoutDirection = DockLayoutDirection.Horizontal, size: number = 200) {
        const splitter = new CDockSplitter(this._hash('dms'), primary, secondary, direction, size);
        return splitter;
    }

    private static _counter = 0;
    private static _hash(prefix: string) {
        return `${prefix}-${++CDockManager._counter}`;
    }

    public static moveForm(root: CDockLayoutItem, formId: string, panelId: string) {
        const [form, source] = this._findForm(formId, root);
        const { found: destination } = this._findLayoutItem(panelId, root, null, null);

        if (form && source && destination) {
            // remove from source panel
            const index = source.forms.findIndex(f => f.id === formId);
            source.forms.splice(index, 1);

            // add form to destination panel
            (destination as CDockPanel).forms.push(form);

            root = this._occupyFreeSpace(root, root);
        }

        return root;
    }

    private static _occupyFreeSpace(root: CDockLayoutItem, start: CDockLayoutItem) {

        if (start.type === DockLayoutItemType.Splitter) {

            const splitter = start as CDockSplitter;
            if (splitter.primary.type === DockLayoutItemType.Splitter) {
                this._occupyFreeSpace(root, splitter.primary);
            }

            if (splitter.secondary.type === DockLayoutItemType.Splitter) {
                this._occupyFreeSpace(root, splitter.secondary);
            }

            if (splitter.primary.type === DockLayoutItemType.Panel) {

                const panel1 = splitter.primary as CDockPanel;
                if (panel1.forms.length === 0) {
                    return this._replace(root, splitter, splitter.secondary as CDockPanel);
                }
            }

            if (splitter.secondary.type === DockLayoutItemType.Panel) {
                const panel2 = splitter.secondary as CDockPanel;
                if (panel2.forms.length === 0) {
                    return this._replace(root, splitter, splitter.primary as CDockPanel);
                }

            }
        }

        return root;
    }

    private static _replace(root: CDockLayoutItem, remove: CDockSplitter, replace: CDockPanel): CDockLayoutItem {
        const { found, parent } = this._findLayoutItem(remove.id, root, null, null);
        if (found && parent) {
            if (found.id === parent.primary.id) {
                parent.primary = replace;
            } else if (found.id === parent.secondary.id) {
                parent.secondary = replace;
            }

            return root;
        } else {
            return replace;
        }
    }

    private static _findForm(formId: string, layoutItem: CDockLayoutItem): [CDockForm | null, CDockPanel | null] {
        if (layoutItem.type === DockLayoutItemType.Panel) {
            const panel = (layoutItem as CDockPanel);
            const form = panel.forms.find(f => f.id === formId)
            if (form) return [form, panel];
            else return [null, null];

        } else if (layoutItem.type === DockLayoutItemType.Splitter) {
            const splitter = (layoutItem as CDockSplitter)
            const [form, panel] = this._findForm(formId, splitter.primary);
            if (Boolean(form)) {
                return [form, panel];
            }
            else {
                const [form, panel] = this._findForm(formId, splitter.secondary);
                if (Boolean(form)) {
                    return [form, panel];
                }
            }
        }

        return [null, null];
    }

    private static _findLayoutItem(searchId: string, layoutItem: CDockLayoutItem, parent: CDockSplitter | null, side: DockLayoutSide | null)
        : { found: CDockLayoutItem | null, parent: CDockSplitter | null, side: DockLayoutSide | null } {

        if (searchId === layoutItem.id) {
            // found!
            return { found: layoutItem, parent, side }
        }

        else if (layoutItem.type === DockLayoutItemType.Splitter) {
            const splitter = layoutItem as CDockSplitter;
            const { found, parent, side } = this._findLayoutItem(searchId, splitter.primary, splitter, DockLayoutSide.Primary);
            if (Boolean(found)) {
                return { found, parent, side };
            }
            else {
                const { found, parent, side } = this._findLayoutItem(searchId, splitter.secondary, splitter, DockLayoutSide.Secondary);
                if (Boolean(found)) {
                    return { found, parent, side };
                }
            }
        }

        return { found: null, parent: null, side: null };
    }
}
