// @flow

import * as THREE from 'three';
import type {Resources} from "../../../../resource";
import {TEXTURE_IDS} from "../../../../resource/texture";
import {HorizontalAnimationMesh} from "../../../../mesh/horizontal-animation";
import type {GaiModel} from "../model/gai-model";
import type {GaiView} from "./gai-view";
import type {PreRender} from "../../../../game-loop/pre-render";
import {HUDCutInScale} from "../../../../hud-scale/hud-scale";
import {HUD_CUT_IN_ZNIDEX} from "../../../../zindex/hud-zindex";

/** メッシュの大きさ */
export const MESH_SIZE = 550;

/** アニメーション数 */
export const MAX_ANIMATION = 1;

/** 右パディング */
export const PADDING_RIGHT = 200;

/**
 * プレイヤー側 ガイ ビュー
 */
export class PlayerGaiView implements GaiView {
  _mesh: HorizontalAnimationMesh;

  /**
   * コンストラクタ
   *
   * @param resources リソース管理オブジェクト
   */
  constructor(resources: Resources) {
    const gaiResource = resources.textures.find(v => v.id === TEXTURE_IDS.GAI_CUTIN);
    const gai = gaiResource?.texture ?? new THREE.Texture();
    this._mesh = new HorizontalAnimationMesh({
      texture: gai,
      maxAnimation: MAX_ANIMATION,
      width: MESH_SIZE,
      height: MESH_SIZE,
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
   * @param preRender プリレンダー情報
   */
  engage(model: GaiModel, preRender: PreRender): void {
    const scale = HUDCutInScale(preRender.rendererDOM, preRender.safeAreaInset) * model.scale;
    const x = preRender.rendererDOM.clientWidth / 2
      + (model.position.x - PADDING_RIGHT) * scale;
    this._mesh.getObject3D().scale.set(scale, scale, scale);
    this._mesh.getObject3D().position.set(x, 0, HUD_CUT_IN_ZNIDEX);
    this._mesh.setOpacity(model.opacity);
  }

  /**
   * シーンに追加するオブジェクトを取得する
   *
   * @return シーンに追加するオブジェクト
   */
  getObject3D(): typeof THREE.Object3D {
    return this._mesh.getObject3D();
  }
}