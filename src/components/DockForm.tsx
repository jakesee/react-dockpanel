import React from 'react';
import { CDockForm, RenderFormEvent } from './hooks';

const styleWrapper = {
  position: 'absolute' as 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const DockForm = ({ form, onRenderForm }: { form: CDockForm; onRenderForm: (e: RenderFormEvent) => void }) => {
  const renderForm = (form: CDockForm) => {
    const event = new RenderFormEvent(form, (<div></div>));
    onRenderForm(event);
    return event.content;
  };

  return <div style={styleWrapper}>{renderForm(form)}</div>;
};

export default DockForm;
