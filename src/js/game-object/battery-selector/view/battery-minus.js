// @flow

import {SimpleImageMesh} from "../../../mesh/simple-image-mesh";
import type {Resources} from "../../../resource";
import {CANVAS_IMAGE_IDS} from "../../../resource/canvas-image";
import * as THREE from "three";
import {ButtonOverlap} from "../../button-overlap/button-overlap";
import {circleButtonOverlap} from "../../button-overlap/circle-button-overlap";
import type {BatterySelectorModel} from "../model";
import {canBatteryMinus} from "../model/can-battery-minus";
import type {GameObjectAction} from "../../action/game-object-action";
import type {Stream} from "../../../stream/core";

/** メッシュサイズ */
const MESH_SIZE = 256;

/** コンストラクタのパラメータ */
type Param = {
  resources: Resources,
  listener: Stream<GameObjectAction>,
  onPush: () => void
};

/** バッテリーマイナスボタン */
export class BatteryMinus {
  _group: typeof THREE.Group;
  _activeButton: SimpleImageMesh;
  _buttonDisabled: SimpleImageMesh;
  _overlap: ButtonOverlap;

  constructor(param: Param) {
    const activeResource = param.resources.canvasImages
      .find(v => v.id === CANVAS_IMAGE_IDS.BATTERY_MINUS);
    const active = activeResource
      ? activeResource.image
      : new Image();
    this._activeButton = new SimpleImageMesh({
      canvasSize: MESH_SIZE,
      meshSize: MESH_SIZE,
      image: active
    });

    const buttonDisabledResource = param.resources.canvasImages
      .find(v => v.id === CANVAS_IMAGE_IDS.SMALL_BUTTON_DISABLED);
    const buttonDisabled = buttonDisabledResource
      ? buttonDisabledResource.image
      : new Image();
    this._buttonDisabled = new SimpleImageMesh({
      canvasSize: MESH_SIZE,
      meshSize: MESH_SIZE,
      image: buttonDisabled
    });

    this._overlap = circleButtonOverlap({
      radius: 80,
      segments: 32,
      listener: param.listener,
      onButtonPush: () => {
        param.onPush();
      }
    });

    this._group = new THREE.Group();
    this._group.add(this._activeButton.getObject3D());
    this._group.add(this._buttonDisabled.getObject3D());
    this._group.add(this._overlap.getObject3D());
  }

  /** デストラクタ */
  destructor(): void {
    this._activeButton.destructor();
    this._buttonDisabled.destructor();
    this._overlap.destructor();
  }

  /** モデルをビューに反映させる */
  update(model: BatterySelectorModel): void {
    this._activeButton.setOpacity(model.opacity);
    this._activeButton.getObject3D().scale.set(
      model.minusButtonScale,
      model.minusButtonScale,
      model.minusButtonScale
    );

    const isDisabledVisible = !canBatteryMinus(model);
    const disabledOpacity = isDisabledVisible ? model.opacity : 0;
    this._buttonDisabled.setOpacity(disabledOpacity);
    this._buttonDisabled.getObject3D().scale.set(
      model.minusButtonScale,
      model.minusButtonScale,
      model.minusButtonScale
    );
  }

  /** シーンに追加するオブジェクトを取得する */
  getObject3D(): typeof THREE.Object3D {
    return this._group;
  }
}