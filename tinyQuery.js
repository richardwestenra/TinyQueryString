// TinyQueryString - A really tiny URL query string utility
// author : Richard Westenra
// license : MIT
// richardwestenra.com/tiny-query-string

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['tinyQuery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.tinyQuery = factory();
  }
}(this, function () {
  'use strict';

  var getRegex = function(name) {
    return new RegExp('[\?&](' + name + ')=?([^&#]*)', 'i');
  };

  var setDefault = function(text) {
    return typeof text === 'undefined' ? (
      typeof window === 'undefined' ? '' : window.location.search
    ) : text;
  };

  return {
    get: function() {
      if (arguments.length === 1) {
        return this.getAll.apply(this, arguments);
      } else if (typeof arguments[0] === 'object') {
        return this.getMany.apply(this, arguments);
      } else {
        return this.getOne.apply(this, arguments);
      }
    },

    getOne: function(name, text) {
      var match = setDefault(text).match( getRegex(name) );
      if (!match) {
        return false;
      } else if (match[2]) {
        return decodeURIComponent(match[2]);
      } else {
        return true;
      }
    },

    getMany: function(arr, text) {
      return arr.map(function(d) {
        return this.get(d, setDefault(text));
      }.bind(this));
    },

    getAll: function(text) {
      text = setDefault(text).match(/\?(.+)/);
      if (!text) {
        return [];
      }
      return text[1].split('&').map(function(d) {
        var s = d.split('=');
        return s.length < 2 ? d : { name: s[0], value: s[1] };
      });
    },

    set: function() {
      return  (typeof arguments[0] === 'object') ? 
        this.setMany.apply(this, arguments) :
        this.setOne.apply(this, arguments);
    },

    setOne: function(name, value, text) {
      text = setDefault(text);
      var regex = getRegex(name),
        match = regex.exec(text),
        pair = value ? name + '=' + encodeURIComponent(value) : name;

      if (!text.length || text.indexOf('?') < 0) {
        return (text || '') + '?' + pair;
      } else if (match) {
        return text.replace(regex, match[0].charAt(0) + pair);
      } else {
        return text + '&' + pair;
      }
    },

    setMany: function(arr, text) {
      return arr.reduce(function(txt, d) {
        return typeof d === 'object' ? 
          this.setOne(d.name, d.value, txt) :
          this.setOne(d, false, txt);
      }.bind(this), setDefault(text));
    },

    remove: function() {
      if (arguments.length === 1) {
        return this.removeAll.apply(this, arguments);
      } else if (typeof arguments[0] === 'object') {
        return this.removeMany.apply(this, arguments);
      } else {
        return this.removeOne.apply(this, arguments);
      }
    },

    removeOne: function(name, text) {
      text = setDefault(text).match(/([^\?]*)(\?*.*)/);
      if (!text) {
        return false;
      } else if (!text[2].length) {
        return text[1];
      } else {
        return this.setMany(this.getAll(text[2]).filter(function(d){
          return d !== name && d.name !== name;
        }), text[1]);
      }
    },

    removeMany: function(arr, text) {
      return arr.reduce(function(txt, d) {
        return this.removeOne(d, txt);
      }.bind(this), setDefault(text));
    },

    removeAll: function(text) {
      return setDefault(text).split('?')[0];
    }
  };
}));