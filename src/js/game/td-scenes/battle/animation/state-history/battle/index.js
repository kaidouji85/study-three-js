// @flow

import {Animate} from "../../../../../../animation/animate";
import {BattleSceneView} from "../../../view";
import type {BattleSceneState} from "../../../state/battle-scene-state";
import type {Battle, GameStateX} from "gbraver-burst-core";
import {empty} from "../../../../../../animation/delay";
import {attackAnimation} from "./attack";
import {toBattleAnimationParam} from "./animation-param";

/**
 * 戦闘アニメーション
 *
 * @param view ビュー
 * @param sceneState シーンステート
 * @param gameState ゲームステート
 * @return アニメーション
 */
export function battleAnimation(view: BattleSceneView, sceneState: BattleSceneState, gameState: GameStateX<Battle>): Animate {
  const param = toBattleAnimationParam(view, sceneState, gameState);
  if (!param) {
    return empty();
  }

  return attackAnimation(param);
}

