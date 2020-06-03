// @flow

import {Animate} from "../../../animation/animate";
import type {BurstButtonModel} from "../model/burst-button-model";
import {tween} from "../../../animation/tween";

/**
 * 決定アニメーション
 *
 * @param model モデル
 * @return アニメーション
 */
export function decide(model: BurstButtonModel): Animate {
  return tween(model, t => t.to({scale: 1.2}, 100))
    .chain(tween(model, t => t.to({scale: 1}, 100)));
}