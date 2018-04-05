// @flow

import {CanvasMesh} from "../../../../mesh/canvas-mesh";
import type {Resources} from "../../../../resource/index";
import type {BatterySliderModel} from "../model/battery-slider-model";
import {drawBatterySlider} from "../../../../canvas/battery-slider/index";
import * as THREE from "three";
import {TouchLocation} from "./touch-location";
import type {TouchRaycastContainer} from "../../../../screen-touch/touch/touch-raycaster";
import type {MouseRaycaster} from "../../../../screen-touch/mouse/mouse-raycaster";

/** メッシュの大きさ */
export const MESH_SIZE = 512;

/** コンストラクタのパラメータ */
type Param = {
  /** リソース管理オブジェクト */
  resources: Resources,
  /** ゲージ最大値 */
  maxValue: number,
};

/** バッテリースライダーのビュー */
export class BatterySliderView {
  /** バッテリースライダーを描画するキャンバス */
  _canvasMesh: CanvasMesh;
  /** バッテリースライダーメーターの当たり判定 */
  _touchLocation: TouchLocation;
  /** ゲームループで使うためにリソース管理オブジェクトをキャッシュする */
  _resources: Resources;

  constructor(param: Param) {
    this._canvasMesh = new CanvasMesh({
      meshWidth: MESH_SIZE,
      meshHeight: MESH_SIZE,
      canvasWidth: MESH_SIZE,
      canvasHeight: MESH_SIZE,
    });
    this._touchLocation = new TouchLocation(param.maxValue);
    this._resources = param.resources;
  }

  /** ビューにモデルを反映させる */
  gameLoop(model: BatterySliderModel): void {
    this._refreshGauge(model);
    this._refreshPos();
  }

  /** バッテリースライダーを更新する */
  _refreshGauge(model: BatterySliderModel): void {
    this._canvasMesh.draw((context: CanvasRenderingContext2D) => {
      context.clearRect(0, 0, this._canvasMesh.canvas.width, this._canvasMesh.canvas.height);

      // バッテリースライダーが中央に描画されるようにする
      const dx = this._canvasMesh.canvas.width / 2;
      const dy = this._canvasMesh.canvas.height / 2;
      drawBatterySlider(context, this._resources, model.battery, model.maxBattery, dx, dy);
    });
  }

  /** 表示位置を更新する */
  _refreshPos(): void {
    const dx = 0;
    const dy = 0;
    this._canvasMesh.mesh.position.x = dx;
    this._canvasMesh.mesh.position.y = dy;
    this._touchLocation.setPos(dx, dy);
  }

  /** マウスが重なっているスライダーの目盛りを返す */
  getMouseOverlap(mouse: MouseRaycaster): number[] {
    return this._touchLocation.getMouseOverlap(mouse);
  }

  /** 指が重なっているスライダーの目盛りを返す */
  getTouchOverlap(touch: TouchRaycastContainer): number[] {
    return this._touchLocation.getTouchOverlap(touch);
  }

  /** シーンに追加するthree.jsのオブジェクトを返す */
  getThreeJsObjectList(): THREE.Mesh[] {
    const canvas = this._canvasMesh.getThreeJsObjectList();
    const touchLocation = this._touchLocation.getThreeJsObjectList();
    return [...canvas, ...touchLocation];
  }
}