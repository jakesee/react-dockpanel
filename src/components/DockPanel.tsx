import { ReactNode, useRef, useState } from 'react';
import DockForm from './DockForm';
import styled from 'styled-components';
import { CDockForm, CDockPanel, DockingEvent, DragDropable, DockEvent, DockPosition } from './hooks';
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
`;

export const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;

  div {
    padding: 2px 6px;
    background-color: #4d6082;
    color: #ffffff;

    cursor: pointer;
  }

  div.active {
    background-color: #ffffff;
    color: #000000;
  }
`;

const DockPanel = ({ panel, onStack, onSplit, onStacking, onSplitting, onRenderForm }: {
  panel: CDockPanel;
  onStack: (e: DockEvent) => boolean;
  onSplit: (e: DockEvent) => boolean;
  onStacking: (e: DockingEvent) => boolean;
  onSplitting: (e: DockingEvent) => boolean;
  onRenderForm: (form: CDockForm) => ReactNode;
}) => {
  const [activeForm, setActiveForm] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const dragDrop = new DragDropable();

  const handleStack = (e: DragEvent, source: string): boolean => {
    let handled = onStack(new DockEvent(e, source, panel.id, panelRef.current, DockPosition.Center));
    if (handled) {
      setActiveForm(prev => Math.min(panel.forms.length - 1, prev));
      handled = true;
    }
    return handled;
  };

  const handleSplit = (e: DragEvent, source: string): boolean => {
    let handled = onSplit(new DockEvent(e, source, panel.id, panelRef.current, DockPosition.Unknown));
    if (handled) {
      setActiveForm(prev => Math.min(panel.forms.length - 1, prev));
      handled = true;
    }
    return handled;
  };

  const handleStacking = (e: DragEvent, source: string): boolean => {

    return onStacking(new DockingEvent(e, source, panel.id, panelRef.current));
  }

  const handleSplitting = (e: DragEvent, source: string): boolean => {

    return onSplitting(new DockingEvent(e, source, panel.id, panelRef.current));
  }

  const renderTabs = () => (
    <Tabs className="tabs" onDragOver={e => dragDrop.onDragOver(e.nativeEvent, handleStacking)} onDrop={e => dragDrop.onDrop(e.nativeEvent, handleStack)}>
      {panel.forms.map((f, i) => (
        <div
          key={f.id}
          className={activeForm === i ? 'active' : ''}
          onClick={() => setActiveForm(i)}
          draggable
          onDragStart={e => dragDrop.onDragStart(e.nativeEvent, f.id)}
        >
          {f.title}
        </div>
      ))}
    </Tabs>
  );

  const renderForm = () => (
    <Wrapper id={panel.id} ref={panelRef} className="dock-panel">
      <Title
        draggable
        onDragStart={e => dragDrop.onDragStart(e.nativeEvent, panel.forms[activeForm].id)}
        onDragOver={e => dragDrop.onDragOver(e.nativeEvent, handleStacking)}
        onDrop={e => dragDrop.onDrop(e.nativeEvent, handleStack)}
      >
        {panel.forms[activeForm].title}
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
    <NoContent id={panel.id} ref={panelRef}
      onDragOver={e => dragDrop.onDragOver(e.nativeEvent, handleStacking)}
      onDrop={e => dragDrop.onDrop(e.nativeEvent, handleStack)}>
      <div>Drop a form here to display {panel.id}</div>
    </NoContent>
  );

  return (
    <>
      {panel.forms.length > 0 ? renderForm() : renderEmpty()}
    </>
  );
};

export default DockPanel;
