import { useContext, useState, useLifecycle } from '../../../src';
import { RaceNameContext } from './context';

export const useStopwatch = (target) => {
  const title = useContext(target, RaceNameContext);
  const time = useState(target, 0);

  const countSecond = () =>
    time.setState(prevTime => prevTime + 1);

  let interval;

  useLifecycle(target, 'componentDidMount', () => interval = setInterval(countSecond, 1000));
  useLifecycle(target, 'componentWillUnmount', () => clearInterval(interval));

  return {
    getTitle: () => title.getContext(),
    getTime: () => time.getState()
  };
};
