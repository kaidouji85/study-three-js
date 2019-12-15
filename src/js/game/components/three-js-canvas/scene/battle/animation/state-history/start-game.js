// @flow

import {Animate} from "../../../../../../../animation/animate";
import {BattleSceneView} from "../../view";
import type {BattleSceneState} from "../../state/battle-scene-state";
import type {GameState} from "gbraver-burst-core/lib/game-state/game-state";
import {delay, empty} from "../../../../../../../animation/delay";
import {all} from "../../../../../../../animation/all";
import {dolly} from "../td-camera";

/**
 * ゲーム開始時のアニメーション
 *
 * @param view ビュー
 * @param sceneState シーンの状態
 * @param gameState ゲームの状態
 */
export function startGameAnimation(view: BattleSceneView, sceneState: BattleSceneState, gameState: GameState): Animate {
  const activeTDPlayer = view.td.players.find(v => v.playerId === gameState.activePlayerId);
  const activeStatus = gameState.players.find(v => v.playerId === gameState.activePlayerId);
  if (!activeTDPlayer || !activeStatus) {
    return empty();
  }

  const attackerX = activeTDPlayer.sprite.getObject3D().position.x;
  return dolly(view.td.camera, attackerX, 500)
    .chain(delay(100))
    .chain(all(
      activeTDPlayer.sprite.turnStart(),
      activeTDPlayer.turnStart.popUp()
    ))
    .chain(delay(100))
    .chain(activeTDPlayer.sprite.turnStartToStand())
    .chain(delay(800));
}