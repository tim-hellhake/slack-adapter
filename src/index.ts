/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import { SlackAdapter } from './slack-adapter';
import { SlackNotifier } from './slack-notifier';

export = (addonManager: any, manifest: any) => {
    new SlackAdapter(addonManager, manifest);
    new SlackNotifier(addonManager, manifest);
};
