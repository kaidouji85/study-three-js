// @flow

import type {BurstButtonModel} from "../model/burst-button-model";
import {tween} from "../../../animation/tween";
import {process} from '../../../animation/process';
import {Animate} from "../../../animation/animate";

/**
 * バーストボタンを非表示にする
 *
 * @param model モデル
 * @return アニメーション
 */
export function close(model: BurstButtonModel): Animate {
  return process(() => {
    model.disabled = true;
    model.opacity = 1;
  })
    .chain(tween(model, t => t.to({opacity: 0}, 200)));
}