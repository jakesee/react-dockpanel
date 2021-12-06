import DockPanel from './DockPanel';
import { CDockLayoutItem, DockLayoutItemType, CDockPanel, CDockSplitter, Movable, Point, DockEvent, DockingEvent, RenderEvent, CDockForm } from './interface';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { FormActivateEvent } from '..';

const getSeparatorStyle = (vertical: boolean): React.CSSProperties => {
  return {
    backgroundColor: '#304261',
    flex: '0 0 4px',
    zIndex: '999',
    cursor: vertical ? 'row-resize' : 'col-resize',
  };
};

const getPrimaryStyle = (): React.CSSProperties => {
  const style = {position: 'relative' as 'relative',
  flex: '1 1 auto',
  backgroundColor: 'var(--systemColor)',}

  return style;
}

const getSecondaryStyle = (isVertical: boolean, size: number):React.CSSProperties => {
  const style = {
    position: "relative" as "relative",
    flex: "0 1 auto",
    backgroundColor: "var(--systemColor)",
  };
  
  if (isVertical) {
    return { ...style, height: `${size}%` };
  } else {
    return { ...style, width: `${size}%` };
  }
};

const getWrapperStyle = (isVertical: boolean): React.CSSProperties => {
  const style = {
    display: 'flex' as 'flex',
    position: 'absolute' as 'absolute',
    width: '100%',
    height: '100%'
  }

  if (isVertical) {
    return { ...style, flexDirection: 'column' as 'column' };
  } else {
    return { ...style, flexDirection: 'row' as 'row' };
  }
};

const DockLayout = ({
  layout,
  onStack,
  onSplit,
  onStacking,
  onSplitting,
  onRenderForm,
  onRenderTab,
  onRenderPanel,
  onFormActivate,
}: {
  layout: CDockLayoutItem;
  onStack: (e: DockEvent) => void;
  onSplit: (e: DockEvent) => void;
  onStacking: (e: DockingEvent) => void;
  onSplitting: (e: DockingEvent) => void;
  onRenderForm: (e: RenderEvent<CDockForm>) => void;
  onRenderTab?: (e: RenderEvent<CDockForm>) => void;
  onRenderPanel?: (e: RenderEvent<CDockPanel>) => void;
  onFormActivate: (e: FormActivateEvent) => void;
}) => {
  const isSplitter = layout.type === DockLayoutItemType.Splitter;
  const splitter = layout as CDockSplitter;
  const panel = layout as CDockPanel;

  const splitterRef = useRef<HTMLDivElement | null>(null);
  const separatorRef = useRef<HTMLDivElement | null>(null);

  const [secondarySize, setSecondarySize] = useState<number>(splitter.size ?? 50);

  const movable = new Movable((_delta, target) => {
    if (isSplitter) {
      handleMove(target);
    }
  });

  const getSecondaryPaneSize = (splitterRect: DOMRect, separatorRect: DOMRect, clientPosition: Point, offsetMouse: boolean) => {
    let totalSize;
    let sepSize;
    let offset;
    const splitter = layout as CDockSplitter;
    if (splitter.isVertical) {
      totalSize = splitterRect.height;
      sepSize = separatorRect.height;
      offset = clientPosition.y - splitterRect.top;
    } else {
      totalSize = splitterRect.width;
      sepSize = separatorRect.width;
      offset = clientPosition.x - splitterRect.left;
    }
    if (offsetMouse) {
      offset -= sepSize / 2;
    }
    if (offset < 0) {
      offset = 0;
    } else if (offset > totalSize - sepSize) {
      offset = totalSize - sepSize;
    }

    let secondaryPaneSize = totalSize - sepSize - offset;
    let primaryPaneSize = totalSize - sepSize - secondaryPaneSize;
    secondaryPaneSize = (secondaryPaneSize * 100) / totalSize;
    primaryPaneSize = (primaryPaneSize * 100) / totalSize;
    sepSize = (sepSize * 100) / totalSize;
    totalSize = 100;

    // adjust minimum sizes here as required
    const primaryMinSize = 10; // percentage
    const secondaryMinSize = 10; // percentage
    if (primaryPaneSize < primaryMinSize) {
      secondaryPaneSize = Math.max(secondaryPaneSize - (primaryMinSize - primaryPaneSize), 0);
    } else if (secondaryPaneSize < secondaryMinSize) {
      secondaryPaneSize = Math.min(totalSize - sepSize - primaryMinSize, secondaryMinSize);
    }

    return secondaryPaneSize;
  };

  const handleMove = (target: Point) => {
    const separator = separatorRef.current;
    const splitter = splitterRef.current;
    if (separator && splitter) {
      const containerRect = splitter.getBoundingClientRect();
      const splitterRect = separator.getBoundingClientRect();
      const secondaryPaneSize = getSecondaryPaneSize(containerRect, splitterRect, target, true);
      //clearSelection();
      setSecondarySize(secondaryPaneSize);
    }
  };

  const isResizeListened = useRef(false);
  const handleResize = () => {
    const separator = separatorRef.current;
    const splitter = splitterRef.current;
    if (separator && splitter) {
      const splitterRect = splitter.getBoundingClientRect();
      const separatorRect = separator.getBoundingClientRect();
      const secondaryPaneSize = getSecondaryPaneSize(splitterRect, separatorRect, new Point(separatorRect.left, separatorRect.top), false);
      setSecondarySize(secondaryPaneSize);
    }
  };

  useEffect(() => {
    if (!isResizeListened.current) {
      window.addEventListener('resize', handleResize);
      isResizeListened.current = true;
      return () => window.removeEventListener('resize', handleResize);
    }

    return;
  }, [handleResize]);

  const renderSplitter = () => (
    <>
      <div className="dock-splitter-primary" style={getPrimaryStyle()}>
        <DockLayout
          layout={splitter.primary}
          onStack={onStack}
          onSplit={onSplit}
          onStacking={onStacking}
          onSplitting={onSplitting}
          onRenderForm={onRenderForm}
          onRenderTab={onRenderTab}
          onRenderPanel={onRenderPanel}
          onFormActivate={onFormActivate}
        />
      </div>
      <div
        className="dps-separator"
        style={getSeparatorStyle(splitter.isVertical)}
        ref={separatorRef}
        onMouseDown={e => movable.onMouseDown(e.nativeEvent)}
        onTouchStart={e => movable.onTouchStart(e.nativeEvent)}
      />
      <div className="dock-splitter-secondary" style={getSecondaryStyle(splitter.isVertical, secondarySize)}>
        <DockLayout
          layout={splitter.secondary}
          onStack={onStack}
          onSplit={onSplit}
          onStacking={onStacking}
          onSplitting={onSplitting}
          onRenderForm={onRenderForm}
          onRenderTab={onRenderTab}
          onRenderPanel={onRenderPanel}
          onFormActivate={onFormActivate}
        />
      </div>
    </>
  );

  const renderPanel = () => (
    <div className="dock-splitter-primary" style={getPrimaryStyle()}>
      <DockPanel
        panel={panel}
        onStack={onStack}
        onSplit={onSplit}
        onStacking={onStacking}
        onSplitting={onSplitting}
        onRenderForm={onRenderForm}
        onRenderTab={onRenderTab}
        onRenderPanel={onRenderPanel}
        onFormActivate={onFormActivate}
      />
    </div>
  );

  return (
    <div style={getWrapperStyle(splitter.isVertical)} className="dock-layout" id={layout.id} ref={splitterRef}>
      {isSplitter ? renderSplitter() : renderPanel()}
    </div>
  );
};

export default DockLayout;
