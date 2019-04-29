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

const deviceDescription = {
  '@context': 'https://iot.mozilla.org/schemas/',
  '@type': 'thing',
  name: 'Slack',
  description: 'Sends messages to your slack workspace'
};

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
  constructor(adapter, config) {
    super(adapter, SlackDevice.name);
    this.config = config;

    for (const property in deviceDescription) {
      this[property] = deviceDescription[property];
    }

    this.addAction(notifyDescription.title, notifyDescription);

    this.messages = {};

    if (config.messages) {
      for (const message of config.messages) {
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
    const device = new SlackDevice(this, manifest.moziot.config);
    this.handleDeviceAdded(device);
  }
}

module.exports = SlackAdapter;
