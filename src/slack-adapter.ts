/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import fetch from 'node-fetch';

import { Adapter, Device } from 'gateway-addon';

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
  private messages: { [key: string]: any } = {};

  constructor(adapter: SlackAdapter, private manifest: any) {
    super(adapter, manifest.display_name);
    this['@context'] = 'https://iot.mozilla.org/schemas/';
    this.name = manifest.display_name;
    this.description = manifest.description;

    const {
      messages
    } = manifest.moziot.config;

    this.addAction(notifyDescription.title, notifyDescription);

    this.messages = {};

    if (messages) {
      for (const message of messages) {
        this.messages[message.name] = message.message;

        const action = {
          '@type': notifyDescription['@type'],
          title: message.name,
          description: notifyDescription.description
        };

        console.log(`Creating action for ${message.name}`);
        this.addAction(message.name, action);
      }
    }
  }

  async performAction(action: any) {
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

export class SlackAdapter extends Adapter {
  constructor(addonManager: any, manifest: any) {
    super(addonManager, SlackAdapter.name, manifest.name);
    addonManager.addAdapter(this);
    const device = new SlackDevice(this, manifest);
    this.handleDeviceAdded(device);
  }
}
