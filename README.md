# eggshell

  Lightweight debugger in mobile

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][npm-url]
  [![Travis Build][travis-image]][travis-url]
  [![Coverage Status][coveralls-image]][coveralls-url]

  [![Dependency Status][david-image]][david-url]
  [![devDependency Status][david-dev-image]][david-dev-url]
  [![peerDependency Status][david-peer-image]][david-peer-url]


## Installation

  With npm

    $ npm install meggshell

## How to do it

### four finger debug

```
// Default four finger,Close default four finger
XLDebug.finger.close();

// If you want to modify the finger, pass a number as a parameter
XLDebug.finger.open();
```

### eggshell log

```
// Two fingers at the same time, click on the screen, 10 times will pop-up prompts
XLDebug.log.openSysConsole();

// close 'eggshell log'
XLDebug.log.close();

// start 'eggshell log'
XLDebug.log.open();
```

## License

MIT

