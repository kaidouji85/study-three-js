// @flow

import type {ArmdozerAnimation} from "../../mesh/armdozer-animation";
import type {Resources} from "../../../../resource";
import {TEXTURE_IDS} from "../../../../resource/texture";
import {HorizontalArmdozerAnimation} from "../../mesh/horizontal-animation";
import {MESH_Y} from "./position";
import {MESH_HEIGHT, MESH_WIDTH} from './mesh-size';

export const MAX_ANIMATION = 4;

/**
 * ウィングドーザ アッパー チャージ
 *
 * @param resources リソース管理オブジェクト
 * @return メッシュ
 */
export function wingDozerUpperCharge(resources: Resources): ArmdozerAnimation {
  const ret = new HorizontalArmdozerAnimation({
    id: TEXTURE_IDS.WING_DOZER_UPPER_CHARGE,
    maxAnimation: MAX_ANIMATION,
    resources: resources,
    width: MESH_WIDTH,
    height: MESH_HEIGHT
  });
  const object = ret.getObject3D();
  object.position.y = MESH_Y;
  object.position.z = 1;
  return ret;
}