// @flow

import '../css/style.css';
import {Game} from './game/index';
import {DefinePlugin} from "./webpack/define-plugin";
import {MonolithicBrowser} from '@gbraver-burst-network/monolithic-browser';

/**
 * Gブレイバーバーストのエントリポイント
 */
async function main(): Promise<void> {
  const game = new Game({
    resourceRoot: {
      get: () => DefinePlugin.resourceHash
    },
    api: new MonolithicBrowser(DefinePlugin.apiServerURL),
    howToPlayMovieURL: DefinePlugin.howToPlay,
    isPerformanceStatsVisible: DefinePlugin.isPerformanceStatsVisible === 'true',
    isServiceWorkerUsed: DefinePlugin.isServiceWorkerUsed === 'true',
    canCasualMatch: DefinePlugin.canCasualMatch === 'true',
  });
  await game.initialize();
}

window.addEventListener('load', () => {
  main();
});