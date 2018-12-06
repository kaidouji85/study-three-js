// @flow

import type {Resources} from "../../../../resource";
import type {ArmdozerMesh} from "../../mesh/armdozer-mesh";
import {HorizontalAnimationMesh} from "../../mesh/horizontal-animation-mesh";
import {TEXTURE_IDS} from "../../../../resource/texture";

export const MAX_ANIMATION = 16;
export const MESH_WIDTH = 320;
export const MESH_HEIGHT = 320;

/** シンブレイバーパンチ */
export function shinBraverPunch(resources: Resources): ArmdozerMesh {
  const ret = new HorizontalAnimationMesh({
    id: TEXTURE_IDS.SHIN_BRAVER_PUNCH,
    maxAnimation: MAX_ANIMATION,
    resources: resources,
    width: MESH_WIDTH,
    height: MESH_HEIGHT
  });
  ret.mesh.position.y = 140;
  return ret;
}