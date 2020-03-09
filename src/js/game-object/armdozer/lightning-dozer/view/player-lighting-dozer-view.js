// @flow

import type {LightningDozerView} from "./lightning-dozer-view";
import type {Resources} from "../../../../resource";
import type {ArmdozerAnimation} from "../../mesh/armdozer-animation";
import {lightningDozerStand} from "../mesh/stand";
import type {LightningDozerModel} from "../model/lightning-dozer-model";
import * as THREE from "three";

/**
 * プレイヤー側のライトニングドーザビュー
 */
export class PlayerLightingDozerView implements LightningDozerView {
  _group: THREE.Group;
  _stand: ArmdozerAnimation;

  constructor(resources: Resources) {
    this._group = new THREE.Group();

    this._stand = lightningDozerStand(resources);
    this._group.add(this._stand.getObject3D());
  }

  /** デストラクタ相当の処理 */
  destructor(): void {
    this._stand.destructor();
  }

  /**
   * モデルをビューに反映させる
   *
   * @param model モデル
   */
  engage(model: LightningDozerModel): void {
    this._group.position.set(
      model.position.x,
      model.position.y,
      model.position.z
    );

    this._stand.visible(true);
    this._stand.animate(0);
  }

  /**
   * シーンに追加するオブジェクトを取得する
   *
   * @return シーンに追加するオブジェクト
   */
  getObject3D(): THREE.Object3D {
    return this._group;
  }

  /**
   * カメラの真正面を向く
   *
   * @param camera カメラ
   */
  lookAt(camera: THREE.Camera): void {
    this._group.quaternion.copy(camera.quaternion);
  }
}