var simflux = require('simflux'),
    Immutable = require('immutable');
    dispatcher = require('./dispatcher.jsx');

var actionCreator = dispatcher.registerActionCreator({
  clickTimelineDot: function (dot) {
    dispatcher.dispatch('click:timeline:dot', dot);
  },
  init: function () {
    var tabId = chrome.devtools.inspectedWindow.tabId;

    //Create a port with background page for continuous message communication
    var port = chrome.extension.connect({
      name: "simflux connection"
    });

    // @todo: does it make sense to have a data stream in an action creator?
    //        (maybe we should think of the stream as a view component)
    // Listen to messages from the background page
    port.onMessage.addListener(function(message) {
      if (message.tabId === tabId && 'startIdx' in message) {
        //_this.processHistory(message);
        dispatcher.dispatch('process:chart:data', {history:message});
      }
    });
  }
});

module.exports = actionCreator;