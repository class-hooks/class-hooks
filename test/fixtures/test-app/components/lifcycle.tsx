import React from 'react';
import { useLifecycle } from '../../../../src';

const useMountReport = (target) => {
  useLifecycle(target, 'componentDidMount', () => window['useLifecycleWasExecuted'] = true);
};

export class ComponentWithLifecycleHook extends React.Component {
  private mountReport = useMountReport(this);

  componentDidMount() {
    window['componentDidMountWasExecuted'] = true;
  }

  render() {
    return <span>useMountAndSaveOnWindow</span>;
  }
}
