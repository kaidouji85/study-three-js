// @flow

import type {BatteryEnchantmentModel} from "../model/battery-enchantment-model";
import {Animate} from "../../../animation/animate";
import {tween} from "../../../animation/tween";
import {delay} from "../../../animation/delay";
import {BatteryEnchantmentSounds} from "../sounds/battery-enchantment-sounds";
import {process} from '../../../animation/process';

/**
 * ポップアップ
 *
 * @param model モデル
 * @param sounds 効果音
 * @return アニメーション
 */
export function popUp(model: BatteryEnchantmentModel, sounds: BatteryEnchantmentSounds): Animate {
  return process(() => {
    model.opacity = 0;
    model.scale = 1.2;
    sounds.benefitEffect.play();
  })
    .chain(tween(model, t => t.to({opacity: 1, scale: 1}, 400)))
    .chain(delay(1000))
    .chain(tween(model, t => t.to({opacity: 0, scale: 1.1}, 300)));
}