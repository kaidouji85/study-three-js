// @flow

import type {LightningDozerModel} from "../model/lightning-dozer-model";
import {Animate} from "../../../../animation/animate";
import {process} from "../../../../animation/process";
import {tween} from "../../../../animation/tween";
import {LightningDozerSounds} from "../sounds/lightning-dozer-sounds";

/**
 * ガード -> 立ち
 *
 * @param model モデル
 * @param sounds 音
 * @return アニメーション
 */
export function guardToStand(model: LightningDozerModel, sounds: LightningDozerSounds): Animate {
  return process(() => {
    model.animation.frame = 1;
    model.animation.type = 'GUARD';
    sounds.motor.play();
  }).chain(
    tween(model.animation, t => t
      .to({frame: 0}, 300)
    )
  ).chain(
    process(() => {
      model.animation.frame = 0;
      model.animation.type = 'STAND';
    })
  );
}