# Slack Adapter

[![build](https://github.com/tim-hellhake/slack-adapter/workflows/Build/badge.svg)](https://github.com/tim-hellhake/slack-adapter/actions?query=workflow:Build)
[![dependencies](https://david-dm.org/tim-hellhake/slack-adapter.svg)](https://david-dm.org/tim-hellhake/slack-adapter)
[![devDependencies](https://david-dm.org/tim-hellhake/slack-adapter/dev-status.svg)](https://david-dm.org/tim-hellhake/slack-adapter?type=dev)
[![optionalDependencies](https://david-dm.org/tim-hellhake/slack-adapter/optional-status.svg)](https://david-dm.org/tim-hellhake/slack-adapter?type=optional)
[![license](https://img.shields.io/badge/license-MPL--2.0-blue.svg)](LICENSE)

Send slack messages to your workspace.

## Configuration
1. Go to https://api.slack.com/apps?new_app=1 to create a new slack app in your workspace
2. Go to _Features_/_Incoming Webhooks_
3. Check _Activate Incoming Webhooks_
4. Click on _Add New Webhook to Workspace_ to create a new webhook
5. Select the channel or the user the messages should go to
6. Click on _Authorize_ to confirm
7. Copy the _Webhook URL_ of the new webhook
8. Paste the URL to the addon config _webhookUrl_

## Usage
The addon registers a slack device with a `notify(message)` action.

Currently, a rule can only trigger parameterless actions.

To send slack messages from a rule, you have to register an action with a predefined message.

Go to the settings of the addon and add a rule with a name and a message of your choice.

The slack device now provides a new action with the specified name you can use in a rule.
