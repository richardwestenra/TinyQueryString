// TinyQueryString - A really small URL query strin utility
// author : Richard Westenra
// license : MIT
// richardwestenra.com/tiny-query-string

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['tinyQuery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('tinyQuery'));
  } else {
    root.returnExports = factory(root.tinyQuery);
  }
}(this, function (tinyQuery) {
  'use strict';

  var regex = function(name) {
    return new RegExp('[\\?&](' + name + ')=?([^&#]*)');
  };

  return {
    get: function(name, text) {
      text = text || window.location.search;
      var match = text.match( regex(name) );
      if (!match) {
        return false;
      } else if (match[2]) {
        return decodeURIComponent(match[2]);
      } else {
        return true;
      }
    },

    set: function(name, value, text) {
      text = text || window.location.search;
      var regex = regex(name),
      match = regex.exec(text),
      pair = value ? name + '=' + encodeURIComponent(value) : name;

      if (!text.length || text.indexOf('?') < 0) {
        // If there are no existing queries then create new one:
        return (text || '') + '?' + pair;
      } else if (match) {
        // If there is an existing query for this name then update the value:
        return text.replace(regex, match[0].charAt(0) + pair);
      } else {
        // If there are existing queries but not for this name then add it to the end:
        return text + '&' + pair;
      }
    },

    remove: function(name, text) {
      text = text || window.location.search;
      return text.replace(regex(name), '');
    }
  };
}));