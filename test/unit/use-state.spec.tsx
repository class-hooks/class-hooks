import React from 'react';
import faker from 'faker';
import { render, fireEvent } from '@testing-library/react';
import { useState } from '../../src/hooks/use-state';

describe('useState', () => {
  describe('provides an encapsulated state to the hosting component that', () => {
    it('should optionally have default value', () => {
      const defaultState = faker.lorem.text();

      class ComponentThatDisplaysDefaultState extends React.Component {
        private someString = useState(this, defaultState);

        render() {
          return <span data-testid='span-that-displays-state'>{this.someString.getState()}</span>;
        }
      }

      const dom = render(<ComponentThatDisplaysDefaultState />);
      expect(dom.getByTestId('span-that-displays-state').innerHTML).toEqual(defaultState);
    });

    it('should be updatable with new state', () => {
      const state = faker.lorem.text();

      class ComponentWithButtonThatUpdatesState extends React.Component {
        private someString = useState<string>(this);

        private onButtonClick = () => {
          this.someString.setState(state);
        }

        render() {
          return (
            <>
              <span data-testid='span-that-displays-state'>{this.someString.getState()}</span>
              <button data-testid='update-state-button' onClick={this.onButtonClick}>update state</button>
            </>
          );
        }
      }

      const dom = render(<ComponentWithButtonThatUpdatesState />);
      fireEvent.click(dom.getByTestId('update-state-button'));
      expect(dom.getByTestId('span-that-displays-state').innerHTML).toEqual(state);
    });

    it('should support functional state update as well (derive next state from previous state)', () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      class ComponentWithButtonThatAddsLastName extends React.Component {
        private someName = useState<string>(this, firstName);

        private onButtonClick = () => {
          this.someName.setState(name => `${name} ${lastName}`);
        }

        render() {
          return (
            <>
              <span data-testid='span-that-displays-state'>{this.someName.getState()}</span>
              <button data-testid='add-last-name-button' onClick={this.onButtonClick}>update state</button>
            </>
          );
        }
      }

      const dom = render(<ComponentWithButtonThatAddsLastName />);
      fireEvent.click(dom.getByTestId('add-last-name-button'));
      expect(dom.getByTestId('span-that-displays-state').innerHTML).toEqual(`${firstName} ${lastName}`);
    });

    it('should not interfere with any component state that exists', () => {
      const hookState = faker.lorem.text();
      const componentState = faker.lorem.text();

      class ComponentWithHookStateAndOwnState extends React.Component<{}, { text: string }> {
        private someString = useState<string>(this);
        readonly state = { text: '' };

        private onButtonClick = () => {
          this.setState({ text: componentState });
          this.someString.setState(hookState);
        }

        render() {
          return (
            <>
              <span data-testid='span-that-displays-hook-state'>{this.someString.getState()}</span>
              <span data-testid='span-that-displays-component-state'>{this.state.text}</span>
              <button data-testid='update-all-states-button' onClick={this.onButtonClick}>update state</button>
            </>
          );
        }
      }

      const dom = render(<ComponentWithHookStateAndOwnState />);
      fireEvent.click(dom.getByTestId('update-all-states-button'));
      expect(dom.getByTestId('span-that-displays-hook-state').innerHTML).toEqual(hookState);
      expect(dom.getByTestId('span-that-displays-component-state').innerHTML).toEqual(componentState);
    });
  });
});
