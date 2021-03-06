// @flow

import * as THREE from 'three';
import {FADE_RENDER_ORDER} from "../../../render/render-order/hud-render-order";
import type {FaderModel} from "../model/fader-model";

export const MESH_WIDTH = 1;
export const MESH_HEIGHT = 1;

/** 画面フェーダービュー */
export class FaderView {
  _mesh: typeof THREE.Mesh;

  constructor(z: number) {
    const geometry = new THREE.PlaneGeometry(MESH_WIDTH, MESH_HEIGHT);
    const material = new THREE.MeshBasicMaterial({
      color: 'rgb(23, 23, 23)',
      transparent: true
    });
    this._mesh = new THREE.Mesh(geometry, material);
    this._mesh.position.z = z;
    this._mesh.renderOrder = FADE_RENDER_ORDER;
  }

  /** デストラクタ相当の処理 */
  destructor(): void {
    this._mesh.material.dispose();
    this._mesh.geometry.dispose();
  }

  /**
   * シーンに追加するオブジェクトを取得する
   *
   * @return シーンに追加するオブジェクト
   */
  getObject3D(): typeof THREE.Object3D {
    return this._mesh;
  }

  /**
   * モデルをビューに反映させる
   *
   * @param model モデル
   */
  engage(model: FaderModel): void {
    this._mesh.material.opacity = model.opacity;

    const isTransparent = 0 < model.opacity;
    this._mesh.scale.x = isTransparent
      ? model.width / MESH_WIDTH
      : 1;
    this._mesh.scale.y = isTransparent
      ? model.height / MESH_HEIGHT
      : 1;
  }
}