# eggshell
[![Build Status](https://travis-ci.org/hoosin/MEggshell.svg?branch=master)](https://travis-ci.org/hoosin/MEggshell)
[![GitHub Rank](https://reporank.com/hoosin/MEggshell)](https://reporank.com?u=hoosin&r=MEggshell)


  Lightweight debugger in mobile


## Installation

  With npm

    $ npm install meggshell

## How to do it

### four finger debug

```js
// Default four finger,Close default four finger
meggshell.finger.close();

// If you want to modify the finger, pass a number as a parameter
meggshell.finger.open();
```

### eggshell log

```js
// Two fingers at the same time, click on the screen, 10 times will pop-up prompts
meggshell.log.openSysConsole();

// close 'eggshell log'
meggshell.log.close();

// start 'eggshell log'
meggshell.log.open();
```

## License

MIT

