// @flow

import i18n from 'i18next';


// $FlowFixMe
i18n.t = i18n.t.bind(i18n);

if (__DEV__) {
  global.i18n = i18n;
}

i18n
.init({
  debug: __DEV__,
  initImmediate: false,
  lng: 'en',
  supportedLngs: ['en', 'de'],
  interpolation: {
    escapeValue: false,
    nestingPrefix: '\$t\(',
    nestingSuffix: '\)',
  },
});

// $FlowFixMe
i18n.addResourceBundle('en', 'translation', require('./i18n/en.json'), true);
// $FlowFixMe
i18n.addResourceBundle('de', 'translation', require('./i18n/de.json'), true);
