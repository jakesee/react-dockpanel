import React from 'react';
import { ReactNode } from 'react';
import { CDockForm } from './hooks';

const styleWrapper = {
  position: 'absolute' as 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const DockForm = ({ form, onRenderForm }: { form: CDockForm; onRenderForm: (form: CDockForm) => ReactNode }) => {
  return <div style={styleWrapper}>{onRenderForm(form)}</div>;
};

export default DockForm;
