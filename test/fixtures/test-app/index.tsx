import React from 'react';
import ReactDOM from 'react-dom';
import { ComponentWithLifecycleHook } from './components/lifcycle';
import { ComponentWithStateHook } from './components/state';

export class App extends React.Component {
  render() {
    return (
      <>
        <ComponentWithLifecycleHook />
        <ComponentWithStateHook />
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
