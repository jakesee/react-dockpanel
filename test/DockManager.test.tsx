import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { DockManager } from '../src/components/DockManager';
import { useDockManager } from '../src/components/hooks';

const TestApp = () => {
  const manager = useDockManager();
  return (
    <div>
      <DockManager manager={manager} onRenderForm={() => 'No Content'} />
    </div>
  );
};

describe('it', () => {
  it('renders without crashing', () => {
    render(<TestApp />);
    const textNoForm = screen.getByText(/Drop a form here to display/i);
    expect(textNoForm).toBeTruthy();
  });
});
