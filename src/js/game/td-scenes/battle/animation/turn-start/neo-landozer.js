// @flow

import {Animate} from "../../../../../animation/animate";
import {NeoLandozer} from "../../../../../game-object/armdozer/neo-landozer/neo-landozer";
import {TurnStart} from "../../../../../game-object/turn-start/turn-start";
import {all} from "../../../../../animation/all";
import {delay} from "../../../../../animation/delay";

/**
 * ネオランドーザ ターンスタート
 *
 * @param sprite スプライト
 * @param turnStart ターンスタートインジケータ
 * @return アニメーション
 */
export function neoLandozerTurnStart(sprite: NeoLandozer, turnStart: TurnStart): Animate {
  return all(
    sprite.gutsForTurnStart(),
    delay(600)
      .chain(turnStart.popUp())
  );
}

/**
 * ネオランドーザ ターンスタート -> 立ち
 *
 * @param sprite スプライト
 * @return アニメーション
 */
export function neoLandozerTurnStartToStand(sprite: NeoLandozer): Animate {
  return sprite.gutsToStand();
}