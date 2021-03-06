// @flow

import {RecoverBattery} from "./recover-battery";
import type {Resources} from "../../resource";
import {PlayerRecoverBatteryView} from "./view/player-recover-battery-view";
import {EnemyRecoverBatteryView} from "./view/enemy-recover-battery-view";
import type {GameObjectAction} from "../action/game-object-action";
import type {Stream} from "../../stream/core";

/**
 * プレイヤー側 バッテリー回復
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスな
 * @return バッテリー回復
 */
export function playerRecoverBattery(resources: Resources, listener: Stream<GameObjectAction>): RecoverBattery {
  const view = new PlayerRecoverBatteryView(resources);
  return new RecoverBattery({
    resources: resources,
    listener: listener,
    view: view
  });
}

/**
 * 敵側 バッテリー回復
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスな
 * @return バッテリー回復
 */
export function enemyRecoverBattery(resources: Resources, listener: Stream<GameObjectAction>): RecoverBattery {
  const view = new EnemyRecoverBatteryView(resources);
  return new RecoverBattery({
    resources: resources,
    listener: listener,
    view: view
  });
}