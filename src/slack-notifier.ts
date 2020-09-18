/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const fetch = require('node-fetch');

import { Constants, Notifier, Outlet } from 'gateway-addon';

class SlackOutlet extends Outlet {
  constructor(notifier: SlackNotifier, id: string, private manifest: any) {
    super(notifier, id);
    this.name = 'Slack';
  }

  notify(_title: string, message: string, _level: Constants.NotificationLevel) {
    return this.send(message);
  }

  async send(message: string) {
    console.log(`Sending message: ${message}`);

    const {
      webhookUrl
    } = this.manifest.moziot.config;

    if (webhookUrl && webhookUrl.trim && webhookUrl.trim() !== '') {
      await fetch(webhookUrl, {
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

export class SlackNotifier extends Notifier {
  constructor(addonManager: any, manifest: any) {
    super(addonManager, SlackNotifier.name, manifest.name);

    addonManager.addNotifier(this);

    this.handleOutletAdded(
      new SlackOutlet(this, SlackNotifier.name, manifest)
    );
  }
}
