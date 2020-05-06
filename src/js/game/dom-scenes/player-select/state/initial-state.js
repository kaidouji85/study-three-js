// @flow

import type {PlayerSelectState} from "./player-select-state";
import {ArmDozerIdList} from "gbraver-burst-core";
import type {ResourcePath} from "../../../../resource/path/resource-path";

/**
 * プレイヤーセレクト 初期ステートを生成する
 *
 * @param resourcePath リソースパス
 * @return 生成結果
 */
export function createInitialState(resourcePath: ResourcePath): PlayerSelectState {
  return {
    isVisible: false,
    armdozerIcons: [
      {
        image: `${resourcePath.get()}/armdozer/neo-landozer/player-select.png`,
        armdozerId: ArmDozerIdList.NEO_LANDOZER
      },
      {
        image: `${resourcePath.get()}/armdozer/shin-braver/player-select.png`,
        armdozerId: ArmDozerIdList.SHIN_BRAVER
      },
      {
        image: `${resourcePath.get()}/armdozer/ligjtning-dozer/player-select.png`,
        armdozerId: ArmDozerIdList.LIGHTNING_DOZER
      }
    ]
  };
}