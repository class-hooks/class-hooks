import React from 'react';
import faker from 'faker';
import { render, fireEvent } from '@testing-library/react';
import { useContext } from '../../src/hooks/use-context';

describe('useContext', () => {
  describe('consumes and provides context from a provider and', () => {
    it('should consume and return the context\'s default value', () => {
      const contextDefaultValue = faker.lorem.text();
      const context = React.createContext(contextDefaultValue);

      class ComponentThatDisplaysDefaultState extends React.Component {
        private stringContext = useContext(this, context);

        render() {
          return <span data-testid='span-that-displays-context'>{this.stringContext.getContext()}</span>;
        }
      }

      const dom = render(<ComponentThatDisplaysDefaultState />);
      expect(dom.getByTestId('span-that-displays-context').innerHTML).toEqual(contextDefaultValue);
    });

    it('should consume and return the context\'s value that is passed to the provider', () => {
      const contextValue = faker.lorem.text();
      const context = React.createContext<string>('');

      class ComponentThatDisplaysDefaultState extends React.Component {
        private stringContext = useContext(this, context);

        render() {
          return <span data-testid='span-that-displays-context'>{this.stringContext.getContext()}</span>;
        }
      }

      const dom = render(
        <context.Provider value={contextValue} >
          <ComponentThatDisplaysDefaultState />
        </context.Provider>
      );
      expect(dom.getByTestId('span-that-displays-context').innerHTML).toEqual(contextValue);
    });

    it('should work properly even if the render method is a bound function', () => {
      const contextValue = faker.lorem.text();
      const context = React.createContext<string>('');

      class ComponentThatDisplaysDefaultState extends React.Component {
        private stringContext = useContext(this, context);

        render = () => {
          return <span data-testid='span-that-displays-context'>{this.stringContext.getContext()}</span>;
        }
      }

      const dom = render(
        <context.Provider value={contextValue} >
          <ComponentThatDisplaysDefaultState />
        </context.Provider>
      );
      expect(dom.getByTestId('span-that-displays-context').innerHTML).toEqual(contextValue);
    });
  });
});
