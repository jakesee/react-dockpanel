import { Dispatch, ReactNode, SetStateAction } from 'react';

export class Point {
  constructor(public x: number, public y: number) {}

  public static delta(final: Point, initial: Point) {
    return new Point(final.x - initial.x, final.y - initial.y);
  }

  public static distance2(point1: Point, point2: Point) {
    let dx = point1.x - point2.x;
    let dy = point1.y - point2.y;
    return dx * dx + dy * dy;
  }

  public static scale(point: Point, scale: number) {
    return new Point(point.x * scale, point.y * scale);
  }

  public static sum(initial: Point, final: Point) {
    return new Point(initial.x + final.x, initial.y + final.y);
  }

  public static mid(point1: Point, point2: Point) {
    const offset = Point.scale(Point.delta(point1, point2), 0.5);
    return Point.sum(point2, offset);
  }
}

export class Movable {
  start: Point = { x: 0, y: 0 };
  current: Point = { x: 0, y: 0 };
  isDragging: boolean = false;

  constructor(public onChange: (delta: Point, target: Point) => void) {}

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
      this.onChange(Point.delta(point, this.current), point);

      this.current = point;
      this.__clearSelection();
    }
  }

  private _onEndDrag(point: Point) {
    this.isDragging = false;
    this.current = point;

    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('touchend', this._onTouchEnd);
  }

  private __clearSelection() {
    if (window.getSelection) {
      if (window.getSelection()?.empty) {
        // Chrome
        window.getSelection()?.empty();
      } else if (window.getSelection()?.removeAllRanges) {
        // Firefox
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

  public onDrop(e: DragEvent, action: (e: DragEvent, sourceData: string) => boolean) {
    const data = e.dataTransfer?.getData('source-data');
    if (data && action && action(e, data)) {
      e.stopImmediatePropagation();
    }
  }
}

export class CDockForm {
  constructor(public id: string, public name: string) {}
}

export enum DockLayoutItemType {
  Splitter = 'Splitter',
  Panel = 'Panel',
}

export class CDockLayoutItem {
  constructor(public id: string, public type: DockLayoutItemType) {}
}

export class CDockSplitter extends CDockLayoutItem {
  constructor(public id: string, public primary: CDockLayoutItem, public secondary: CDockLayoutItem, public isVertical: boolean, public size: number) {
    super(id, DockLayoutItemType.Splitter);
  }
}

export class CDockPanel extends CDockLayoutItem {
  constructor(public id: string, public forms: CDockForm[], public activeIndex: number = 0) {
    super(id, DockLayoutItemType.Panel);
  }
}

export enum DockPosition {
  Unknown = 1,
  None = 2,
  Left = 3,
  Right = 4,
  Top = 5,
  Bottom = 6,
  Center = 7,
}

export class DockEvent {
  constructor(
    public nativeEvent: DragEvent,
    public formId: string,
    public panelId: string,
    public panel: HTMLDivElement | null,
    public position: DockPosition,
    public isHandled: boolean = false
  ) {}
}

export class DockingEvent {
  constructor(
    public nativeEvent: DragEvent,
    public formId: string,
    public panelId: string,
    public panel: HTMLDivElement | null,
    public isHandled: boolean = false
  ) {}
}

export class RenderEvent<T> {
  constructor(public item: T, public content: ReactNode, public isHandled: boolean = false) {}
}

export class FormActivateEvent {
  constructor(public panel: CDockPanel, public isHandled: boolean = false) {}
}

export interface IDockManager {
  layout: CDockLayoutItem;
  setLayout: Dispatch<SetStateAction<CDockLayoutItem>>;
  clone: (layout: CDockLayoutItem) => CDockLayoutItem;
  createForm: (title: string, cchildren?: ReactNode, cicon?: ReactNode) => CDockForm;
  createPanel: (forms: CDockForm[]) => CDockPanel;
  createSplitter: (primary: CDockLayoutItem, secondary: CDockLayoutItem, isVertical?: boolean, size?: number) => CDockSplitter;
  dock: (formId: string, panelId: string, position: DockPosition) => void;
  remove: (formId: string) => void;
  activate: (panelId: string, activeIndex: number) => void;
}
