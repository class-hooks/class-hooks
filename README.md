<center>

<img src="./logo.svg" />

# class-hooks

> React hooks for class components

</center>

- class-hooks
  * [General](#general)
  * [Getting Started](#getting-started)
    + [Requirements](#requirements)
    + [Install](#install)
    + [Our First Class Hook](#our-first-class-hook)
  * [API](#api)
    + [The Hooks](#the-hooks)
      - [useLifecycle](#uselifecycle)
      - [useState](#usestate)
      - [useContext](#usecontext)
    + [The Rules of Class Hooks](#the-rules-of-class-hooks)

## General
class-hooks is a project that is meant to bring hooks into the world of class components. With class-hooks, you can write reusable pieces of logic that utilize lifecycle methods, state and context, and utilize them in your class components, much like mixins (but without inheriting multiple base-classes) or higher order components (but without changing your react tree with countless wrappers).

### Features
- 🎓 **Easy to use** - two lines and you're there!
- 👓 **Transparent** - does not change how your class component works!
- 📦 **Encapsulated** - wrap all of your logic into a single custom hook, augment your components!
- ⌨️ **Fully Typed** - full typescript support and finely tuned type hints!

### Why Class Hooks
Functional components are clean. They are simple, straight forward and also pure, which is really very intuitive.
They do have some pitfalls, though, such as:
- Each render ocurrs in a different scope, so no `this`
- The closure changes every time the state changes, so handlers cannot access up-to-date state, and instead have to rely on refs (or be disposed and re-registered each render)

Class components, while more complicated, do have their benefit:
- Explicit way to hook into the component's lifecycle
- Finer grain regarding when and how a component re-renders
- Everything is declared once upon mount, and can then be reused

Class hooks are intended for those of us who feel comfortable with class components, but also want to pack together logic in an intuitive way and "decorate" their components with further functionality.

## Getting Started
### Requirements
In order to use class hooks, you need to be using React 16.3 or later, as the new context api is required for `useContext`.

### Install
Install `class-hooks` by running:

```bash
npm install class-hooks
```

or if you prefer yarn:

```bash
yarn add class-hooks
```

### Our First Class Hook
Let's write a `useStopwatch` class hook. This hook simply counts the seconds from the moment that the component was mounted, and can be queried for the time that have passed.

Our class hook will hook into React's lifecycle methods using `useLifecycle` in order to initialize a `setInterval` upon mount and clear it upon unmount, and keep the time that have passed using `useState`: 

```tsx
import { useLifecycle, useState } from 'class-hooks';

const useStopwatch = (target) => {
  const time = useState(target, 0);

  const countSecond = () => {
    time.setState(prevTime => prevTime + 1);
  }

  let interval;
  useLifecycle(target, 'componentDidMount', () =>
    interval = setInterval(countSecond, 1000));
  useLifecycle(target, 'componentWillUnmount', () =>
    clearInterval(interval));

  return {
    getTime: () => time.getState()
  };
}



import React from 'react';

class StopwatchComponent extends React.Component {
  stopwatch = useStopwatch(this);

  render() {
    return (
      <span>It has been {stopwatch.getTime()} seconds</span>
    );
  }
}
```

## API
### The Hooks
#### useLifecycle
Hooks into a given component lifecycle method, and invokes a given function. Useful for executing side effects, such as registering non-react event handlers, initializing routines, or reacting to updates.

Signature:
- `useLifecycle(target, lifecycleMethodName, fn): void`

Returns:
- `void`

Respective React hooks counterpart:
- `useEffect`

#### useState
Saves an encapsulated piece of state. This state is part of the component's lifecycle, so the component **will** react to state changes. Does not collide with values that are saved on the component's state. Useful for saving state that is internal to the custom hook that you're implementing.

Signature:
- `useState(target, defaultState?): UseStateClassHook`

Returns:
- `getState()` - returns state
- `setState(nextStateOrFn)` accepts the next state value, or a function of the form: `(prevState) => nextState`.

Respective React hooks counterpart:
- `useState`

#### useContext
TBA

### The Rules of Class Hooks
In order to get the best out of class hooks, there are several rules that we need to follow:

#### 1. `target` is always the first parameter
The component instance is passed explicitly into class hooks as the first parameter. When using hooks, make sure to pass `this` as the first parameter, always. When writing your own hooks, don't forget to incldue `target` as the first parameter - this is the component instance you're wrapping!

```ts
const useMyCustomClassHook = (target, ...) => {
  ...
}
```

#### 2. Class Hooks are only called once
With React Hooks, the hook function is being called for every render. That is not the case for class hooks, as they are created once when the component is constructed. This means that you can count of the fact that the variable you declare inside your custom hook stick around with you until the hosting component is unmounted.

#### 3. Always use with class fields
Class hooks are initialized right after `super()` was called, and right before the constructor was executed (if one exists). Using them anywhere else might make them not work properly, and introduce bugs to your code:

**✅ Do:**
```tsx
class MyComponent extends React.Component {
  myHook = useMyHook(this);

  componentDidMount() {
    ...
  }

  componentDidUpdate() {
    ...
  }

  render() {
    ...
  }
}
```

**🚫 Don't:**
```tsx
class MyComponent extends React.Component {
  componentDidMount() {
    useMyHook(this); // will not be called before the constructor!
  }

  componentDidUpdate() {
    useMyHook(this); // might be called more than once!
  }

  render() {
    ...
  }
}
```

Assign the hooks to class fields even if they return nothing (like `useLifecycle`).

#### 4. Props are accessible
Initial props can be used when initializing class hooks. Just bear in mind that hooks do not **react** to props - they only have access to the initial props when they are being created:

```tsx
class MyComponent extends React.Component {
  count = useState(this, this.props.initialCount);

  render() {
    ...
  }
}
```
