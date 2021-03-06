// @flow

import type {BattleSceneState} from "./battle-scene-state";
import type {PlayerId} from "gbraver-burst-core";

/** 初期状態を生成する */
export function createInitialState(playerId: PlayerId): BattleSceneState {
  return {
    playerId: playerId,
  };
}