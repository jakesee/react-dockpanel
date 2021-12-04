import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DockLayoutDirection, DockManager, useDockManager } from './..';

const App = () => {

  const manager = useDockManager();

  React.useEffect(() => {

    const form1 = manager.createForm('Properties');
    const form2 = manager.createForm('Class View');
    const form3 = manager.createForm('Document');

    const panel1 = manager.createPanel([form1, form2]);
    const panel2 = manager.createPanel([form3]);

    const splitter = manager.createSplitter(panel1, panel2, DockLayoutDirection.Horizontal);

    manager.setLayout(splitter);

  }, []);

  return (
    <div>
      <DockManager manager={manager} onRenderForm={ () => 'No Content'}/>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
