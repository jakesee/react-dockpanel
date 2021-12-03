import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DockManager, useDockManager } from './..';

const App = () => {

  const manager = useDockManager();

  React.useEffect(() => {

  }, []);

  return (
    <div>
      <DockManager dockManager={manager} onRenderForm={ () => 'No Content'}/>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
