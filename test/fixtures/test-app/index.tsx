import React from 'react';
import ReactDOM from 'react-dom';
import { useStopwatch } from './hook';
import { RaceNameContext } from './context';

class TimerLabel extends React.Component {
  stopWatch = useStopwatch(this);

  render() {
    return (
      <span>
        <span data-testid='title'>{this.stopWatch.getTitle()}</span><br />
        <span data-testid='time'>{this.stopWatch.getTime()}</span> <span>seconds</span>
      </span>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <RaceNameContext.Provider value='Test App Race'>
        <TimerLabel />
      </RaceNameContext.Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
