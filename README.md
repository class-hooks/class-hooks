<img src="./logo.svg" />

# class-hooks
> React hooks for class components

[![Travis](https://img.shields.io/travis/illBeRoy/class-hooks.svg?style=flat-square)](https://travis-ci.org/illBeRoy/concurrentp/)
[![npm](https://img.shields.io/npm/v/class-hooks.svg?style=flat-square)
](https://www.npmjs.com/package/concurrentp)

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
class-hooks is a project that is meant to bring hooks into the world of class components. With class-hooks, you can write reusable pieces of logic that utilize lifecycle methods, state and context as complete black boxes, and utilize them in your class components.

### Features
- 🎓 **Easy to use** - two lines and you're there!
- 👓 **Transparent** - does not change how your class component works!
- 📦 **Encapsulated** - wrap all of your logic into a single custom hook, augment your components!
- ⌨️ **Fully Typed** - full typescript support and finely tuned type hints!

### Why Class Hooks
Separating logic from presentation is an intuitive part of many React applications. The practices to do so today are mostly Higher Order Components and Render Props\Functions. The first imposes a Container\Presentational (smart \ dumb) components, and essentially affects your React tree. The other affects your render method at the very least. In both cases, **you shape your components around how you inject the data it's built upon**.

React Hooks brought a breath of fresh air in that regard: now, you can write **logic components**, compose them and write abstractions over them, and seamlessly hook them into your component without having to change how it is written. Class Hooks brings this into the class components world - now, you can write logical components, and once you hook them into your component, they just work.

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

> ℹ️ context is only accessible after the component is mounted. Therefore, you cannot use `getContext` from the body of a custom hook.

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
