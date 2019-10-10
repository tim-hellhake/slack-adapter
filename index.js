/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const SlackAdapter = require('./slack-adapter');

module.exports =
  (addonManager, manifest) => {
    new SlackAdapter(addonManager, manifest);

    try {
      const SlackNotifier = require('./slack-notifier');
      new SlackNotifier(addonManager, manifest);
    } catch (e) {
      if (!(e instanceof TypeError)) {
        console.error(e);
      }
    }
  };
