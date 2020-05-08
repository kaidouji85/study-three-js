// @flow

import type {PlayerSelectState} from "./player-select-state";
import type {ResourcePath} from "../../../../resource/path/resource-path";

/**
 * プレイヤーセレクト 初期ステートを生成する
 *
 * @param resourcePath リソースパス
 * @return 生成結果
 */
export function createInitialState(resourcePath: ResourcePath): PlayerSelectState {
  return {
    canOperation: true
  };
}