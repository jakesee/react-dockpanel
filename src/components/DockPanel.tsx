import { ReactNode, useRef } from 'react';
import DockForm from './DockForm';
import styled from 'styled-components';
import { CDockForm, CDockPanel, DockingEvent, DragDropable, DockEvent, DockPosition, RenderEvent, FormActivateEvent } from './interface';
import React from 'react';

const NoContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #293955;
  height: 100%;

  div {
    color: #fff;
  }
`;

export const Wrapper = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr min-content;

  height: 100%;
  overflow: none;
  background-color: #293955;
`;

export const Content = styled.div`
  background-color: #fff;
  position: relative;
  overflow: hidden;

  height: 100%;
  width: 100%;
`;

export const Title = styled.div`
  color: #fff;
  background-color: #4d6082;
  padding: 4px 6px;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
`;

export const Tabs = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1px;

  div.tab {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;

    padding: 2px 6px;
    background-color: #4d6082;
    color: #ffffff;
    cursor: pointer;

    &.active {
      background-color: #ffffff;
      color: #000000;
    }
  }
`;

const DockPanel = ({
  panel,
  onStack,
  onSplit,
  onStacking,
  onSplitting,
  onRenderForm,
  onRenderTab,
  onRenderPanel,
  onFormActivate,
}: {
  panel: CDockPanel;
  onStack: (e: DockEvent) => void;
  onSplit: (e: DockEvent) => void;
  onStacking: (e: DockingEvent) => void;
  onSplitting: (e: DockingEvent) => void;
  onFormActivate: (e: FormActivateEvent) => void;
  onRenderForm?: (e: RenderEvent<CDockForm>) => void;
  onRenderTab?: (e: RenderEvent<CDockForm>) => void;
  onRenderPanel?: (e: RenderEvent<CDockPanel>) => void;
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const dragDrop = new DragDropable();

  const handleStack = (e: DragEvent, source: string): boolean => {
    const event = new DockEvent(e, source, panel.id, panelRef.current, DockPosition.Center);
    onStack(event);
    return true;
  };

  const handleSplit = (e: DragEvent, source: string): boolean => {
    const event = new DockEvent(e, source, panel.id, panelRef.current, DockPosition.Unknown);
    onSplit(event);
    return true;
  };

  const handleStacking = (e: DragEvent, source: string): boolean => {
    const event = new DockingEvent(e, source, panel.id, panelRef.current);
    onStacking(event);
    return true;
  };

  const handleSplitting = (e: DragEvent, source: string): boolean => {
    const event = new DockingEvent(e, source, panel.id, panelRef.current);
    onSplitting(event);
    return true;
  };

  const renderTab = (form: CDockForm): ReactNode => {
    const event = new RenderEvent<CDockForm>(form, form.name);
    onRenderTab && onRenderTab(event);
    return event.content;
  };

  const renderPanel = (panel: CDockPanel): ReactNode => {
    const event = new RenderEvent<CDockPanel>(panel, panel.forms[panel.activeIndex].name);
    onRenderPanel && onRenderPanel(event);
    return event.content;
  };

  const handleFormActivate = (index: number) => {
    panel.activeIndex = index;
    const event = new FormActivateEvent(panel);
    onFormActivate(event);
  };

  const renderTabs = () => (
    <Tabs className="tabs" onDragOver={e => dragDrop.onDragOver(e.nativeEvent, handleStacking)} onDrop={e => dragDrop.onDrop(e.nativeEvent, handleStack)}>
      {panel.forms.map((f, i) => (
        <div
          key={f.id}
          className={panel.activeIndex === i ? 'tab active' : 'tab'}
          onClick={() => handleFormActivate(i)}
          draggable
          onDragStart={e => dragDrop.onDragStart(e.nativeEvent, f.id)}
        >
          {renderTab(f)}
        </div>
      ))}
    </Tabs>
  );

  const renderForm = () => (
    <Wrapper id={panel.id} ref={panelRef} className="dock-panel">
      <Title
        draggable
        onDragStart={e => dragDrop.onDragStart(e.nativeEvent, panel.forms[panel.activeIndex].id)}
        onDragOver={e => dragDrop.onDragOver(e.nativeEvent, handleStacking)}
        onDrop={e => dragDrop.onDrop(e.nativeEvent, handleStack)}
      >
        {renderPanel(panel)}
      </Title>
      <Content
        className="content"
        onDragOver={e => dragDrop.onDragOver(e.nativeEvent, handleSplitting)}
        onDrop={e => dragDrop.onDrop(e.nativeEvent, handleSplit)}
      >
        <DockForm form={panel.forms[panel.activeIndex]} onRenderForm={onRenderForm} />
      </Content>
      {panel.forms.length > 1 ? renderTabs() : ''}
    </Wrapper>
  );

  const renderEmpty = () => (
    <NoContent
      id={panel.id}
      ref={panelRef}
      onDragOver={e => dragDrop.onDragOver(e.nativeEvent, handleStacking)}
      onDrop={e => dragDrop.onDrop(e.nativeEvent, handleStack)}
    >
      <div>Drop a form here to display {panel.id}</div>
    </NoContent>
  );

  return <>{panel.forms.length > 0 ? renderForm() : renderEmpty()}</>;
};

export default DockPanel;
