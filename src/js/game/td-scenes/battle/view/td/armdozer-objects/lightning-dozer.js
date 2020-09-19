// @flow

import type {Player, PlayerId} from "gbraver-burst-core";
import type {Resources} from "../../../../../../resource";
import {Observable} from "rxjs";
import type {GameObjectAction} from "../../../../../../action/game-object-action";
import {LightningBarrierGameEffect} from "../../../../../../game-object/barrier/lightning/lightning-barrier";
import * as THREE from "three";
import type {TDArmdozerObjects} from "./armdozer-objects";

/**
 * 3Dレイヤー ライトニングドーザ 固有オブジェクト フィールド
 */
interface LightningDozerTDField {
  /** 電撃バリア */
  lightningBarrier: LightningBarrierGameEffect;
}

/**
 * 3Dレイヤー ライトニングドーザ 固有オブジェクト 実装
 */
export class LightningDozerTD implements TDArmdozerObjects, LightningDozerTDField {
  /** プレイヤーID */
  playerId: PlayerId;

  /** 電撃バリア */
  lightningBarrier: LightningBarrierGameEffect;

  constructor(playerId: PlayerId, filed: LightningDozerTDField) {
    this.playerId = playerId;
    this.lightningBarrier = filed.lightningBarrier;
  }

  /**
   * デストラクタ相当の処理
   */
  destructor(): void {
    this.lightningBarrier.destructor();
  }

  /**
   * シーンに追加するオブジェクトを取得する
   *
   * @return シーンに追加するオブジェクト
   */
  getObject3Ds(): typeof THREE.Object3D[] {
    return [];
  }

  /**
   * アームドーザスプライト配下に置かれるオブジェクトを取得する
   *
   * @return アームドーザスプライト配下に置かれるオブジェクト
   */
  getUnderSprite(): typeof THREE.Object3D[] {
    return [
      this.lightningBarrier.getObject3D()
    ];
  }
}

/**
 * プレイヤー 3Dレイヤー ライトニングドーザ固有オブジェクト
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @param state プレイヤー情報
 * @return 生成結果
 */
export function playerLightningDozerTD(resources: Resources, listener: Observable<GameObjectAction>, state: Player): LightningDozerTD {
  return new LightningDozerTD(state.playerId, {
    lightningBarrier: new LightningBarrierGameEffect(resources, listener)
  });
}

/**
 * 敵 3Dレイヤー ライトニングドーザ固有オブジェクト
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @param state プレイヤー情報
 * @return 生成結果
 */
export function enemyLightningDozerTD(resources: Resources, listener: Observable<GameObjectAction>, state: Player): LightningDozerTD {
  return new LightningDozerTD(state.playerId, {
    lightningBarrier: new LightningBarrierGameEffect(resources, listener)
  });
}
