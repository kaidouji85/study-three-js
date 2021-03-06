// @flow

import type {BurstButtonModel} from "../model/burst-button-model";
import {Animate} from "../../../animation/animate";
import {tween} from "../../../animation/tween";
import {process} from '../../../animation/process';

/**
 * バーストボタンを表示する
 *
 * @param model モデル
 * @return アニメーション
 */
export function open(model: BurstButtonModel, canBurst: boolean): Animate {
  return process(() => {
    model.disabled = true;
    model.canBurst = canBurst;
    model.opacity = 0;
  })
    .chain(tween(model, t => t.to({opacity: 1}, 200)))
    .chain(process(() => {
      model.disabled = false;
    }));
}