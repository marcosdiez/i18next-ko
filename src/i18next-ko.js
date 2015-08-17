var i18n = require('i18next-client');
var ko;

var koBindingHandler = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      var i = i18nextko._koElements.indexOf(element);
      if (i >= 0) {
        i18nextko._koElements.splice(i, 1);
        i18nextko._koCallbacks.splice(i, 1);
      }
    });
    i18nextko._koElements.push(element);
    i18nextko._koCallbacks.push(ko.bindingHandlers['i18n'].update.bind(undefined, element, valueAccessor, allBindingsAccessor, viewModel, bindingContext));
    koBindingHandler.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
  },

  update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    var value = ko.toJS(valueAccessor());
    if (typeof value === 'string') {
      element.innerHTML = i18n.t(value);
    } else if (value.key) {
      element.innerHTML = i18n.t(value.key, value.options);
    } else {
      for (var attr in value) {
        var options = value[attr];
        var translation;
        if (typeof options === 'string') {
          translation = i18n.t(options);
        }
        else {
          translation = i18n.t(options.key, ko.toJS(options.options));
        }
        if (attr == 'html') {
          element.innerHTML = translation;
        }
        else {
          var div = document.createElement('div');
          div.innerHTML = translation;
          element.setAttribute(attr, div.innerText);
        }
      }
    }
  }
};

var i18nextko = {
  _koElements: [],
  _koCallbacks: [],

  setLanguage: function (language) {
    i18n.setLng(language);
    i18nextko._koCallbacks.forEach(function (c) {
      return c.call(undefined);
    });
  },

  init: function (resourceStore, language, knockout) {
    ko = knockout || window.ko;

    i18n.init({
      lng: language || 'en',
      resStore: resourceStore
    });

    ko.bindingHandlers['i18n'] = koBindingHandler;
    i18nextko.setLanguage(language);
  }
};

module.exports = i18nextko;
