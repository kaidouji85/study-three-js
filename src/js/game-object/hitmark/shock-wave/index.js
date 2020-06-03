// @flow

import type {Resources} from "../../../resource";
import {ShockWave} from "./shock-wave";
import {PlayerShockWaveView} from "./view/player-shock-wave-view";
import {EnemyShockWaveView} from "./view/enemy-shock-wave-view";
import {Observable} from "rxjs";
import type {GameObjectAction} from "../../../action/game-object-action";
import {initialValue} from "./model/initial-value";

/**
 * プレイヤーの衝撃波を生成する
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @return 衝撃波
 */
export function playerShockWave(resources: Resources, listener: Observable<GameObjectAction>): ShockWave {
  const model = initialValue();
  const view = new PlayerShockWaveView(resources, model);
  return new ShockWave(view, model, resources, listener);
}

/**
 * 敵の衝撃波を生成する
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @return 衝撃波
 */
export function enemyShockWave(resources: Resources, listener: Observable<GameObjectAction>): ShockWave {
  const model = initialValue();
  const view = new EnemyShockWaveView(resources, model);
  return new ShockWave(view, model, resources, listener);
}