/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const fetch = require('node-fetch');

const {
  Adapter,
  Device,
} = require('gateway-addon');

const notifyDescription = {
  '@type': 'NotificationAction',
  title: 'notify',
  description: 'Send message to slack',
  input: {
    type: 'object',
    properties: {
      message: {
        type: 'string'
      }
    }
  }
};

class SlackDevice extends Device {
  constructor(adapter, manifest) {
    super(adapter, manifest.display_name);
    this['@context'] = 'https://iot.mozilla.org/schemas/';
    this.name = manifest.display_name;
    this.description = manifest.description;
    this.config = manifest.moziot.config;

    this.addAction(notifyDescription.title, notifyDescription);

    this.messages = {};

    if (this.config.messages) {
      for (const message of this.config.messages) {
        this.messages[message.name] = message.message;

        const action = {
          '@type': notifyDescription.type,
          title: message.name,
          description: notifyDescription.description
        };

        console.log(`Creating action for ${message.name}`);
        this.addAction(message.name, action);
      }
    }
  }

  async performAction(action) {
    action.start();

    if (action.name === notifyDescription.title) {
      await this.send(action.input.message);
    } else {
      const message = this.messages[action.name];

      if (message) {
        await this.send(message);
      } else {
        console.warn(`Unknown action ${action}`);
      }
    }

    action.finish();
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

class SlackAdapter extends Adapter {
  constructor(addonManager, manifest) {
    super(addonManager, SlackAdapter.name, manifest.name);
    addonManager.addAdapter(this);
    const device = new SlackDevice(this, manifest);
    this.handleDeviceAdded(device);
  }
}

module.exports = SlackAdapter;
