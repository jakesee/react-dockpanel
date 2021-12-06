import { ReactNode, useRef, useState } from 'react';
import DockForm from './DockForm';
import styled from 'styled-components';
import { CDockForm, CDockPanel, DockingEvent, DragDropable, DockEvent, DockPosition, RenderFormEvent, RenderPanelEvent } from './hooks';
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
}: {
  panel: CDockPanel;
  onStack: (e: DockEvent) => void;
  onSplit: (e: DockEvent) => void;
  onStacking: (e: DockingEvent) => void;
  onSplitting: (e: DockingEvent) => void;
  onRenderForm: (e: RenderFormEvent) => void;
  onRenderTab?: (e: RenderFormEvent) => void;
  onRenderPanel?: (e: RenderPanelEvent) => void;
}) => {
  const [activeForm, setActiveForm] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragDrop = new DragDropable();

  const handleStack = (e: DragEvent, source: string): boolean => {
    const event = new DockEvent(e, source, panel.id, panelRef.current, DockPosition.Center);
    console.log('handleStack before', panel.forms.length);
    onStack(event);
    console.log('handleStack after', panel.forms.length);
    console.log(event.isHandled);
    if (!event.isHandled) {
      setActiveForm(panel.forms.length - 1);
      event.isHandled = true;
    }
    return event.isHandled;
  };

  const handleSplit = (e: DragEvent, source: string): boolean => {
    const event = new DockEvent(e, source, panel.id, panelRef.current, DockPosition.Unknown);
    console.log('handleSplit before', panel.forms.length);
    onSplit(event);
    console.log('handleSplit after', panel.forms.length);
    console.log(event.isHandled);
    if (!event.isHandled) {
      setActiveForm(panel.forms.length - 1);
      event.isHandled = true;
    }
    return event.isHandled;
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
    const event = new RenderFormEvent(form, form.name);
    onRenderTab && onRenderTab(event);
    return event.content;
  };

  const renderPanel = (panel: CDockPanel): ReactNode => {
    panel.activeForm = activeForm;
    const event = new RenderPanelEvent(panel, panel.forms[activeForm].name);
    onRenderPanel && onRenderPanel(event);
    return event.content;
  };

  const onDragStart = (e: DragEvent, formId: string) => {
    setActiveForm(prev => Math.min(panel.forms.length - 2, prev));
    dragDrop.onDragStart(e, formId);
  }

  const renderTabs = () => (
    <Tabs className="tabs" onDragOver={e => dragDrop.onDragOver(e.nativeEvent, handleStacking)} onDrop={e => dragDrop.onDrop(e.nativeEvent, handleStack)}>
      {panel.forms.map((f, i) => (
        <div
          key={f.id}
          className={activeForm === i ? 'tab active' : 'tab'}
          onClick={() => setActiveForm(i)}
          draggable
          onDragStart={e => onDragStart(e.nativeEvent, f.id)}
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
        onDragStart={e => onDragStart(e.nativeEvent, panel.forms[activeForm].id)}
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
        <DockForm form={panel.forms[activeForm]} onRenderForm={onRenderForm} />
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
