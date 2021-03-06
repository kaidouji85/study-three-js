// @flow

import {LightningDozerCutIn} from "../../../../../../game-object/cut-in/lightning-dozer/lightning-dozer-cutin";
import type {Player, PlayerId} from "gbraver-burst-core";
import * as THREE from "three";
import type {Resources} from "../../../../../../resource";
import {
  enemyLightningiDozerCutIn,
  playerLightningDozerCutIn
} from "../../../../../../game-object/cut-in/lightning-dozer";
import type {HUDArmdozerObjects} from "./hud-armdozer-ibjects";
import type {GameObjectAction} from "../../../../../../game-object/action/game-object-action";
import type {Stream} from "../../../../../../stream/core";

/**
 * HUDレイヤー ライトニングドーザ固有オブジェクト フィールド
 */
interface LightningDozerHUDField {
  cutIn: LightningDozerCutIn;
}

/**
 * HUDレイヤー ライトニングドーザ固有オブジェクト
 */
export class LightningDozerHUD implements HUDArmdozerObjects, LightningDozerHUDField{
  playerId: PlayerId;
  cutIn: LightningDozerCutIn;

  /**
   * コンストラクタ
   *
   * @param playerId プレイヤーID
   * @param param フィールド
   */
  constructor(playerId: PlayerId, param: LightningDozerHUDField) {
    this.playerId = playerId;
    this.cutIn = param.cutIn;
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
 * プレイヤー HUDレイヤー ライトニングドーザ固有オブジェクト
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @param state プレイヤー情報
 * @return 生成結果
 */
export function playerLightningDozerHUD(resources: Resources, listener: Stream<GameObjectAction>, state: Player): LightningDozerHUD {
  return new LightningDozerHUD(state.playerId, {
    cutIn: playerLightningDozerCutIn(resources, listener)
  });
}

/**
 * 敵 HUDレイヤー ライトニングドーザ固有オブジェクト
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @param state プレイヤー情報
 * @return 生成結果
 */
export function enemyLightningDozerHUD(resources: Resources, listener: Stream<GameObjectAction>, state: Player): LightningDozerHUD {
  return new LightningDozerHUD(state.playerId, {
    cutIn: enemyLightningiDozerCutIn(resources, listener)
  });
}