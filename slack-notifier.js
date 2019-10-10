/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const fetch = require('node-fetch');

const {
  Notifier,
  Outlet,
} = require('gateway-addon');

class SlackOutlet extends Outlet {
  constructor(notifier, id, config) {
    super(notifier, id);
    this.name = 'Slack';
    this.config = config;
  }

  notify(title, message) {
    return this.send(message);
  }

  async send(message) {
    console.log(`Sending message: ${message}`);
    const webhookUrl = this.config.webhookUrl;

    if (webhookUrl && webhookUrl.trim && webhookUrl.trim() !== '') {
      await fetch(this.config.webhookUrl, {
        method: 'post',
        body: JSON.stringify({
          text: message
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } else {
      console.warn('Webhook url not set');
    }
  }
}

class SlackNotifier extends Notifier {
  constructor(addonManager, manifest) {
    super(addonManager, SlackNotifier.name, manifest.name);

    addonManager.addNotifier(this);

    if (!this.outlets[SlackNotifier.name]) {
      this.handleOutletAdded(
        new SlackOutlet(this, SlackNotifier.name, manifest.moziot.config)
      );
    }
  }
}

module.exports = SlackNotifier;
