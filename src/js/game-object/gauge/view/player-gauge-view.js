// @flow

import * as THREE from 'three';
import type {GaugeView} from "./gauge-view";
import type {GaugeModel} from "../model/gauge-model";
import type {Resources} from "../../../resource";
import type {PreRender} from "../../../action/game-loop/pre-render";
import {SimpleImageMesh} from "../../../mesh/simple-image-mesh";
import {CANVAS_IMAGE_IDS} from "../../../resource/canvas-image";
import {PlayerHpBar} from "./player-hp-bar";
import {HpNumber} from "./hp-number";

export const BASE_CANVAS_SIZE = 1024;
export const SCALE = 0.3;

/** プレイヤーゲージのビュー */
export class PlayerGaugeView implements GaugeView {
  _group: THREE.Group;
  _base: SimpleImageMesh;
  _hpBar: PlayerHpBar;
  _hpNumber: HpNumber;

  constructor(resources: Resources) {
    this._group = new THREE.Group();
    this._group.scale.set(SCALE, SCALE, SCALE);

    const gaugeBaseResource = resources.canvasImages
      .find(v => v.id === CANVAS_IMAGE_IDS.PLAYER_GAUGE_BASE);
    const gaugeBase = gaugeBaseResource
      ? gaugeBaseResource.image
      : new Image();
    this._base = new SimpleImageMesh({
      canvasSize: BASE_CANVAS_SIZE,
      image: gaugeBase
    });
    this._group.add(this._base.getObject3D());

    this._hpBar = new PlayerHpBar(resources);
    this._hpBar.getObject3D().position.set(-210 ,30, 1);
    this._group.add(this._hpBar.getObject3D());

    this._hpNumber = new HpNumber(resources);
    this._hpNumber.getObject3D().position.set(100, 60, 1);
    this._group.add(this._hpNumber.getObject3D());
  }

  /** デストラクタ */
  destructor(): void {
    this._base.destructor();
    this._hpBar.destructor();
  }

  /** モデルをビューに反映させる */
  engage(model: GaugeModel): void {
    // TODO ゲージ反映を実装する
    this._hpBar.setValue(model.hp / model.maxHp);
    this._hpNumber.setValue(model.hp);
  }

  /** プリレンダー */
  preRender(action: PreRender): void {
    this._setPos();
    this._lookAt(action.camera);
  }

  /** シーンに追加するオブジェクトを取得する */
  getObject3D(): THREE.Object3D {
    return this._group;
  }

  /** 座標をセットする */
  _setPos(): void {
    this._group.position.x = 150;
    this._group.position.y = 340;
    this._group.position.z = 0;
  }

  /** カメラの真正面を向く */
  _lookAt(camera: THREE.Camera): void {
    this._group.quaternion.copy(camera.quaternion);
  }
}