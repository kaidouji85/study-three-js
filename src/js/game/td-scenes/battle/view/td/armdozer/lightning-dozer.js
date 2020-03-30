// @flow

import type {TDArmdozer} from "./index";
import type {Player, PlayerId} from "gbraver-burst-core/lib/player/player";
import type {Resources} from "../../../../../../resource";
import {Observable} from "rxjs";
import type {GameObjectAction} from "../../../../../../action/game-object-action";
import {LightningBarrierGameEffect} from "../../../../../../game-object/barrier/lightning/lightning-barrier";
import {enemyLightningBarrier, playerLightningBarrier} from "../../../../../../game-object/barrier/lightning";

/**
 * 3Dレイヤー ライトニングドーザ 固有オブジェクト フィールド
 */
interface LightningDozerTDField {
  /** 電撃バリア */
  lightningBarrier: LightningBarrierGameEffect;
}

/**
 * 3Dレイヤー ライトニングドーザ 固有オブジェクト
 */
export interface LightningDozerTD extends TDArmdozer, LightningDozerTDField {}

/**
 * 3Dレイヤー ライトニングドーザ 固有オブジェクト 実装
 */
class LightningiDozerTDImpl implements LightningDozerTD {
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
  getObject3Ds() {
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
  return new LightningiDozerTDImpl(state.playerId, {
    lightningBarrier: playerLightningBarrier(resources)
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
  return new LightningiDozerTDImpl(state.playerId, {
    lightningBarrier: enemyLightningBarrier(resources)
  });
}
