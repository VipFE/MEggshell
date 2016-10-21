# eggshell

  Lightweight debugger in mobile

  [![Build Status](https://travis-ci.org/hoosin/MEggshell.svg?branch=master)](https://travis-ci.org/hoosin/MEggshell)


## Installation

  With npm

    $ npm install meggshell

## How to do it

### four finger debug

```js
// Default four finger,Close default four finger
XLDebug.finger.close();

// If you want to modify the finger, pass a number as a parameter
XLDebug.finger.open();
```

### eggshell log

```js
// Two fingers at the same time, click on the screen, 10 times will pop-up prompts
XLDebug.log.openSysConsole();

// close 'eggshell log'
XLDebug.log.close();

// start 'eggshell log'
XLDebug.log.open();
```

## License

MIT

