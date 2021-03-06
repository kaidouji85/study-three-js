// @flow

import * as THREE from 'three';
import type {ArmdozerIcon} from "./armdozer-icon";
import type {Resources} from "../../../resource";
import {TEXTURE_IDS} from "../../../resource/texture";
import {HorizontalAnimationMesh} from "../../../mesh/horizontal-animation";

/**
 * ライトニングドーザアイコン
 */
export class LightningDozerIcon implements ArmdozerIcon {
  _mesh: HorizontalAnimationMesh;
  _group: typeof THREE.Group;

  /**
   * コンストラクタ
   *
   * @param resources リソース管理オブジェクト
   */
  constructor(resources: Resources) {
    this._group = new THREE.Group();

    const lightningDozer = resources.textures.find(v => v.id === TEXTURE_IDS.LIGHTNING_DOZER_BURST_BUTTON_ICON)
      ?.texture ?? new THREE.Texture();
    this._mesh = new HorizontalAnimationMesh({
      texture: lightningDozer,
      maxAnimation: 1,
      width: 420,
      height: 420,
    });
    this._mesh.animate(1);
    this._mesh.getObject3D().position.x = -15;
    this._mesh.getObject3D().position.y = 200;
    this._group.add(this._mesh.getObject3D());
  }

  /**
   * デストラクタ相当の処理
   */
  destructor(): void {
    this._mesh.destructor();
  }

  /**
   * シーンに追加するオブジェクトを取得する
   *
   * @return シーンに追加するオブジェクト
   */
  getObject3D(): typeof THREE.Object3D {
    return this._group;
  }

  /**
   * 透明度を設定する
   *
   * @param opacity 透明度
   */
  setOpacity(opacity: number): void {
    this._mesh.setOpacity(opacity);
  }
}