import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DockManager, useDockManager } from './..';
import './index.css';

const App = () => {

  const isInit = React.useRef(false);
  const manager = useDockManager();

  React.useEffect(() => {
    if (!isInit.current) {
      const form1 = manager.createForm('Properties');
      const form2 = manager.createForm('Class View');
      const form3 = manager.createForm('Document');

      const panel1 = manager.createPanel([form1, form2]);
      const panel2 = manager.createPanel([form3]);

      const splitter = manager.createSplitter(panel1, panel2);

      manager.setLayout(splitter);

      isInit.current = false;
    }
  }, []);

  return (
    <div>
      <DockManager manager={manager} onRenderForm={ () => 'No Content'}/>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
