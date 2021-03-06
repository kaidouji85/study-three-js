// @flow

import {BattleSceneView} from "../../../view";
import type {BattleSceneState} from "../../../state/battle-scene-state";
import type {GameStateX, PilotSkillEffect} from "gbraver-burst-core";
import {empty} from "../../../../../../animation/delay";
import {Animate} from "../../../../../../animation/animate";
import type {PilotSkillAnimationParam} from "./animation-param";
import {castPilotSkillAnimationParam} from "./animation-param";
import {castShinyaAnimationParam, shinyaAnimation} from "./shinya";
import {castGaiAnimationParam, gaiAnimation} from "./gai";
import {castRaitoAnimationParam, raitoAnimation} from "./raito";
import {castTsubasaAnimationParam, tsubasaAnimation} from "./tsubasa";

/**
 * パイロット効果 アニメーション
 *
 * @param view ビュー
 * @param sceneState シーン状態
 * @param gameState ゲーム状態
 * @return アニメーション
 */
export function pilotSkillAnimation(view: BattleSceneView, sceneState: BattleSceneState, gameState: GameStateX<PilotSkillEffect>): Animate {
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

  const gai = castGaiAnimationParam(param);
  if (gai) {
    return gaiAnimation(gai);
  }

  const raito = castRaitoAnimationParam(param);
  if (raito) {
    return raitoAnimation(raito);
  }

  const tsubasa = castTsubasaAnimationParam(param);
  if (tsubasa) {
    return tsubasaAnimation(tsubasa);
  }

  return empty();
}

