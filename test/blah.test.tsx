import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DockManager } from '../src/components/DockManager';
import { useDockManager } from '../src/components/hooks';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <DockManager
        dockManager={useDockManager()}
        onRenderForm={() => 'Test Content'}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
