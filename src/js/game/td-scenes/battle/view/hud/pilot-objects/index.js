// @flow

import * as THREE from 'three';
import type {PlayerId} from "gbraver-burst-core/lib/player/player";
import type {Resources} from "../../../../../../resource";
import {Observable} from "rxjs";
import type {GameObjectAction} from "../../../../../../action/game-object-action";
import type {Player} from "gbraver-burst-core";
import {PilotIds} from "gbraver-burst-core/lib/master/pilots";
import {enemyShinyaHUD, playerShinyaHUD} from "./shinya";

/**
 * HUD　パイロット関連オブジェクト
 */
export interface HUDPilotObjects {
  /**
   * プレイヤーID
   */
  playerId: PlayerId;

  /**
   * デストラクタ相当の処理
   */
  destructor(): void;

  /**
   * シーンに追加するオブジェクトを取得する
   *
   * @return シーンに追加するオブジェクト
   */
  getObject3Ds(): THREE.Object3D[];
}

/**
 * プレイヤー側 HUDパイロット
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @param state プレイヤー状態
 * @return HUDパイロット
 */
export function playerHUDPilotObjects(resources: Resources, listener: Observable<GameObjectAction>, state: Player): HUDPilotObjects {
  switch (state.pilot.id) {
    case PilotIds.SHINYA:
    default:
      return playerShinyaHUD(resources, listener, state);
  }
}

/**
 * 敵側 HUDパイロット
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @param state プレイヤー状態
 * @return HUDパイロット
 */
export function enemyHUDPilotObjects(resources: Resources, listener: Observable<GameObjectAction>, state: Player): HUDPilotObjects {
  switch (state.pilot.id) {
    case PilotIds.SHINYA:
    default:
      return enemyShinyaHUD(resources, listener, state);
  }
}
