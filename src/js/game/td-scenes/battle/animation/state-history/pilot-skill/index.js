// @flow

import {BattleSceneView} from "../../../view";
import type {BattleSceneState} from "../../../state/battle-scene-state";
import type {GameState} from "gbraver-burst-core";
import {empty} from "../../../../../../animation/delay";
import {Animate} from "../../../../../../animation/animate";
import {castPilotSkillAnimationParam} from "./animation-param";
import type {PilotSkillAnimationParam} from "./animation-param";
import {castShinyaAnimationParam, shinyaAnimation} from "./shinya";

/**
 * パイロット効果 アニメーション
 *
 * @param view ビュー
 * @param sceneState シーン状態
 * @param gameState ゲーム状態
 * @return アニメーション
 */
export function pilotSkillAnimation(view: BattleSceneView, sceneState: BattleSceneState, gameState: GameState): Animate {
  const param = castPilotSkillAnimationParam(view, sceneState, gameState);
  if (!param) {
    return empty();
  }

  return cutIn(param);
}

/**
 * パイロットカットイン
 *
 * @param param パラメータ
 * @return アニメーション
 */
function cutIn(param: PilotSkillAnimationParam): Animate {
  const shinya = castShinyaAnimationParam(param);
  if (shinya) {
    return shinyaAnimation(shinya);
  }

  return empty();
}

