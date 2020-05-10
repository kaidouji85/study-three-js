// @flow

import {Animate} from "../../../../animation/animate";
import {process} from "../../../../animation/process";
import {tween} from "../../../../animation/tween";
import type {LightningDozerModel} from "../model/lightning-dozer-model";

/**
 * アームハンマー -> 立ち
 *
 * @param model モデル
 * @return アニメーション
 */
export function hmToStand(model: LightningDozerModel): Animate {
  return process(() => {
    model.animation.type = 'HM_TO_STAND';
    model.animation.frame = 0;
  }).chain(tween(model.animation, t => t.to({frame: 1}, 400))
  ).chain(process(() => {
    model.animation.type = 'STAND';
    model.animation.frame = 0;
  }))
}
