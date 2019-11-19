<img src="https://github.com/illBeRoy/class-hooks/raw/master/logo.svg?sanitize=true" />

# class-hooks
> Componentize Your Logic

[![Travis](https://img.shields.io/travis/illBeRoy/class-hooks.svg?style=flat-square)](https://travis-ci.org/illBeRoy/class-hooks/)
[![npm](https://img.shields.io/npm/v/class-hooks.svg?style=flat-square)
](https://www.npmjs.com/package/class-hooks)

- [General](#general)
- [Getting Started](#getting-started)
  * [Requirements](#requirements)
  * [Install](#install)
  * [Our First Class Hook](#our-first-class-hook)
- [API](#api)
  * [The Hooks](#the-hooks)
    + [useLifecycle](#uselifecycle)
    + [useState](#usestate)
    + [useContext](#usecontext)
  * [The Rules of Class Hooks](#the-rules-of-class-hooks)

## General
class-hooks are a new way to manage your logic, with one major goal: to help you treat your app model as a set of components that are encapsulated and can be composed upon. It does so by bringing the favorable concept of react hooks into the world of class components, thus giving your hooks lifecycle, state and context - a component that doesn't care about UI, and instead of rendering anything, provides an API for its hosting class component to interact with.

[See class-hooks in action](https://codesandbox.io/s/class-hooks-example-ysg08?fontsize=14&hidenavigation=1&theme=dark)

### Features
- 🎓 **Easy to use** - two lines and you're there!
- 👓 **Transparent** - does not change how your class component works!
- 📦 **Encapsulated** - wrap all of your logic into a single custom hook, augment your components!
- ⌨️ **Fully Typed** - full typescript support and finely tuned type hints!

### Why Class Hooks
> **Class Hooks are components that render API**

Separating logic from presentation is an intuitive part of many React applications. The practices to do so today are mostly Higher Order Components, Container \ Presentational component pairs, and Render Props\Functions. In all of the above cases, **you write components that render no UI, shape others around how their data is injected to them, and bloat your React tree.**.

Class Hooks intends to take the idea of logic \ UI separation one step further. Make your components care only about UI, and not even about **how** they receive the data. No more connects and no more props with the sole purpose of dependency injection. You "decorate" your class component by assigning a hook into a class field, and then you directly use that hook's api from anywhere in your component's code.

Class Hooks leverages on the mechanisms that were first born with React hooks: write hooks, write hooks on top of those hooks, compose them and write abstractions over them, and seamlessly connect them into your component without having to change how it is written. Once it's there, it simply works.

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
Let's write a `useStopwatch` class hook. This class hook simply counts the seconds from the moment that the component was mounted, and can be queried for the time that have passed.

Our class hook will hook into React's lifecycle methods using `useLifecycle` in order to initialize a `setInterval` upon mount and clear it upon unmount. It will also keep the time that have passed using `useState`: 

```tsx
import { useLifecycle, useState } from 'class-hooks';

/**
 *  Here we declare a custom class hook.
 *  The "target" param is the component instance, 
 *  and it's always the first param in any class hook.
 **/
const useStopwatch = (target) => {
  // we create a time state, with default value of 0
  const time = useState(target, 0);

  // when we call this function, the state will be updated
  // to be its previous value plus one.
  // much like Component.setState, we can either set the value
  // or pass a function that calculates it from the previous state.
  const countSecond = () => {
    time.setState(prevTime => prevTime + 1);
  }

  let interval;

  // here we setup the interval upon the component's mount
  useLifecycle(target, 'componentDidMount', () =>
    interval = setInterval(countSecond, 1000));

  // and clear it upon unmount
  useLifecycle(target, 'componentWillUnmount', () =>
    clearInterval(interval));

  // we want to return only the things that the component which uses us needs,
  // that is - a method to get the time that have passed!
  return {
    getTime: () => time.getState()
  };
}



import React from 'react';

class StopwatchComponent extends React.Component {
  // we create the hook and store its return value in a class field
  stopwatch = useStopwatch(this);

  // now we just render the time! it will update every second without the
  // component having to set up anything!
  render() {
    return (
      <span>It has been {this.stopwatch.getTime()} seconds</span>
    );
  }
}
```

You can see this code in action on [code sandbox](https://codesandbox.io/s/class-hooks-example-ysg08?fontsize=14&hidenavigation=1&theme=dark).

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

> About `shouldComponentUpdate`: the hook implementation for that specific lifecycle hook is to be the least intrusive: if `useLifecycle(target, 'shouldComponentUpdate', ...)` return true, then true is returned to the React renderer. But, if it returned false, then the returned value ignores it completely, and only the wrapped component's `shouldComponentUpdate` is taken into account.

#### useState
Keeps an encapsulated piece of state. This state is part of the component's lifecycle, so the component **will** react to state changes. Does not collide with values that are saved on the component's state. Useful for saving state that is internal to the custom hook that you're implementing.

Signature:
- `useState(target, defaultState?): UseStateClassHook`

Returns:
- `getState()` - returns state
- `setState(nextStateOrFn)` accepts the next state value, or a function of the form: `(prevState) => nextState`.

Respective React hooks counterpart:
- `useState`

#### useContext
Consumes and holds the value of a context. This hook lets you programmatically access a given context from your component, without having to wrap it with a consumer or pass a render prop.

Signature:
- `useContext(target, context): UseContextClassHook`

Returns:
- `getContext()` - returns the context's value

Respective React hooks counterpart:
- `useContext`

> context is only accessible after the component is mounted. Therefore, you cannot use `getContext` from the body of a custom hook.

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
With React Hooks, the hook function is being called for every render. That is not the case for class hooks, as they are created once when the component is constructed. As a result, you can rely on the fact that the variables you declare inside your custom hooks stick around with you until the hosting component is unmounted.

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
