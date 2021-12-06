import React from 'react';
import { CDockForm, RenderEvent } from './interface';

const styleWrapper = {
  position: 'absolute' as 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const DockForm = ({ form, onRenderForm }: { form: CDockForm; onRenderForm?: (e: RenderEvent<CDockForm>) => void }) => {
  const renderForm = (form: CDockForm) => {
    const event = new RenderEvent<CDockForm>(form, (<div></div>));
    onRenderForm && onRenderForm(event);
    if (!event.isHandled) {
      return event.content;
    } else {
      return <></>;
    }
  };

  return <div style={styleWrapper}>{renderForm(form)}</div>;
};

export default DockForm;
