// @flow

import * as THREE from "three";
import type {SkyBrightnessModel} from "../model/sky-brightness-model";

/** 全体の大きさ */
export const SIZE = 5000;

/** 空の明るさビュー */
export class SkyBrightnessView {
  _mesh: typeof THREE.Mesh;

  constructor() {
    const geometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
    const material = new THREE.MeshBasicMaterial({
      color: 'rgb(0, 0, 0)',
      side: THREE.BackSide,
      transparent: true,
    });
    this._mesh = new THREE.Mesh(geometry, material);
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
   * モデルをビューに反映する
   *
   * @param model モデル
   */
  engage(model: SkyBrightnessModel): void {
    const opacity = 1 - model.brightness;
    this._mesh.material.opacity = opacity;
  }
}