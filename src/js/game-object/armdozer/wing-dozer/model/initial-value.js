// @flow

import type {WingDozerModel} from "./wing-dozer-model";
import {ARMDOZER_SPRITE_STANDARD_X, ARMDOZER_SPRITE_STANDARD_Y, ARMDOZER_SPRITE_STANDARD_Z} from "../../position";

/**
 * 初期値を生成する
 *
 * @return 生成した初期値
 */
export function createInitialValue(): WingDozerModel {
  return {
    position: {
      x: ARMDOZER_SPRITE_STANDARD_X,
      y: ARMDOZER_SPRITE_STANDARD_Y,
      z: ARMDOZER_SPRITE_STANDARD_Z,
    },
    animation: {
      type: 'STAND',
      frame: 0
    }
  };
}