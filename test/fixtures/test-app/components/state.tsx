import React from 'react';
import { useState } from '../../../../src';

const useCounter = (target) => {
  const count = useState(target, 0);
  const plusOne = () => count.setState(count => count + 1);
  const getCount = () => count.getState();

  return {
    getCount,
    plusOne
  };
};

export class ComponentWithStateHook extends React.Component {
  private counter = useCounter(this);

  private onClickButton = () => {
    this.counter.plusOne();
  }

  render() {
    return (
      <>
        <span data-hook='counter-label'>{this.counter.getCount()}</span>
        <button data-hook='counter-button' onClick={this.onClickButton}>Increase Counter</button>
      </>
    );
  }
}
