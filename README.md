# foxlog

## Description

Foxlog is a simple console application that monitor a w3c-formatted HTTP access log. It will display on the screen the most visited section of the website, the total number of hits and the total number of bytes transferred during the last 10 seconds.

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


