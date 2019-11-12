# foxlog

## Description

Foxlog is a simple console application that monitor a [w3c-formatted HTTP access log](https://www.w3.org/Daemon/User/Config/Logging.html). It will display on the screen the most visited section of the website, the total number of hits and the total number of bytes transferred during the last 10 seconds.

Foxlog manages an alert system that tracks whenever the average hit per second exceed a threshold during the last 2 minutes. The history of alerts will stay on screen until the app is closed.


## Getting Started

To run the app use :

```sh
yarn start
# or
node ./src/main.js
```

By default, the app will monitor the /tmp/access.log but it can be overridden by the first command line argument.

By default, the app has a hit per second threshold of 10 hits per second but it can be overridden by the second command line argument.

You must specify the monitored file path if you want to change the hit per second threshold.

You can pass a third argument to the app. If this argument is true, a fake w3c-formatted HTTP access log generator will write to the monitored file path.

```sh
# Example 1
yarn start /path/to/my/log/file.log 12
# Example 2
node ./src/main.js /tmp/mylog.log 9 true
```

You can use the dockerfile to build a docker image that will behave exactly like the app.


## Architecture

The app is divided into 3 pieces :
* The parsers
* The logics
* The loggers

The parser modules are responsible for extracting all the data of the w3c-formatted HTTP access logs.

The logic modules represent all the logic of the app, there is a module that represents and handles hits (hit.js), a module that analyses a list of hits (synthesis.js), and a module that manages the alerts (alert-manager.js).

The logger modules are responsible for mapping the output of logic functions to logging string that will be displayed to the screen.

## Tests

To run the tests : 

```
yarn test
```

## Suggested improvement

For the moment, foxlog does not handle the time zone of dates of the log (09/May/2018:16:00:39 __+0000__).

Adding a better way to manage the console line arguments and adding a help section (-h).

Adding more statistics.


