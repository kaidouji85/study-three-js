// @flow

import type {HUDPilotObjects} from "./hud-pilot-objects";
import type {Player, PlayerId} from "gbraver-burst-core";
import {RaitoCutIn} from "../../../../../../game-object/cut-in/raito/raito";
import * as THREE from "three";
import type {Resources} from "../../../../../../resource";
import {enemyRaitoCutIn, playerRaitoCutIn} from "../../../../../../game-object/cut-in/raito";
import type {GameObjectAction} from "../../../../../../game-object/action/game-object-action";
import type {Stream} from "../../../../../../stream/core";

/**
 * コンストラクタのパラメータ
 */
type Params = {
  playerId: PlayerId,
  cutIn: RaitoCutIn
};

/**
 * ライトHUD
 */
export class RaitoHUD implements HUDPilotObjects {
  playerId: PlayerId;
  cutIn: RaitoCutIn;

  /**
   * コンストラクタ
   *
   * @param params パラメータ
   */
  constructor(params: Params) {
    this.playerId = params.playerId;
    this.cutIn = params.cutIn;
  }

  /**
   * デストラクタ相当の処理
   */
  destructor(): void {
    this.cutIn.destructor();
  }

  /**
   * シーンに追加するオブジェクトを取得する
   *
   * @return シーンに追加するオブジェクト
   */
  getObject3Ds(): typeof THREE.Object3D[] {
    return [
      this.cutIn.getObject3D()
    ];
  }
}

/**
 * プレイヤー側 ライトHUD
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @param state プレイヤーの状態
 * @return ライトHUD
 */
export function playerRaitoHUD(resources: Resources, listener: Stream<GameObjectAction>, state: Player): RaitoHUD {
  return new RaitoHUD({
    playerId: state.playerId,
    cutIn: playerRaitoCutIn(resources, listener)
  });
}

/**
 * 敵側 ライトHUD
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @param state プレイヤーの状態
 * @return ライトHUD
 */
export function enemyRaitoHUD(resources: Resources, listener: Stream<GameObjectAction>, state: Player): RaitoHUD {
  return new RaitoHUD({
    playerId: state.playerId,
    cutIn: enemyRaitoCutIn(resources, listener)
  });
}