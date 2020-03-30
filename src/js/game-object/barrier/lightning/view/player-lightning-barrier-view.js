// @flow

import type {LightningBarrierView} from "./lightning-barrier-view";
import {HorizontalAnimationMesh} from "../../../../mesh/horizontal-animation";
import type {Resources} from "../../../../resource";
import {TEXTURE_IDS} from "../../../../resource/texture";
import * as THREE from "three";
import type {LightningBarrierModel} from "../model/lightning-barrier-model";

const WIDTH = 200;
const HEIGHT = 200;
const MAX_ANIMATION = 8;

/**
 * プレイヤー側 電撃バリアビュー
 */
export class PlayerLightningBarrierView implements LightningBarrierView {
  _mesh: HorizontalAnimationMesh;

  constructor(resources: Resources) {
    const textureResource = resources.textures.find(v => v.id === TEXTURE_IDS.BARRIER_LIGHTNING);
    const texture = textureResource
      ? textureResource.texture
      : new THREE.Texture();
    this._mesh = new HorizontalAnimationMesh({
      texture: texture,
      maxAnimation: MAX_ANIMATION,
      width: WIDTH,
      height: HEIGHT,
    });
  }

  /**
   * デストラクタ相当の処理
   */
  destructor(): void {
    this._mesh.destructor();
  }

  /**
   * モデルをビューに反映させる
   *
   * @param model モデル
   */
  engage(model: LightningBarrierModel): void {
    const target = this._mesh.getObject3D();
    target.position.set(
      model.position.x,
      model.position.y,
      model.position.z
    );
    target.scale.set(1, 1, 1);
  }

  /**
   * シーンに追加するオブジェクトを取得する
   *
   * @return シーンに追加するオブジェクト
   */
  getObject3D(): THREE.Object3D {
    return this._mesh.getObject3D();
  }
}