// @flow

import {CanvasMesh} from "../../../../util/mesh/canvas-mesh";
import {BatteryGaugeView} from '../base';
import type {BatteryGaugeModel} from "../base";
import type {Resources} from "../../../../resource/resource-manager";
import * as THREE from "three";
import {rectangle} from "../../../../util/uv-mapping/rectangle";
import {drawEnemyBatteryGauge, drawPlayerBatteryGauge} from "../../../../util/canvas/draw/battery-gauge";

/** 敵バッテリーゲージ */
export class EnemyBatteryGaugeView extends CanvasMesh implements BatteryGaugeView {
  _modelCache: BatteryGaugeModel;

  constructor(resources: Resources) {
    const meshWidth = 300;
    const meshHeight = 80;

    super({
      resources,
      meshWidth,
      meshHeight,
      canvasWidth: 256,
      canvasHeight: 256,
    });
    this._modelCache = {
      battery: 0,
      maxBattery: 0
    };

    // バッテリーゲージに必要な大きさだけテクスチャから抜き取る
    rectangle({
      geo: this.mesh.geometry,
      pos: new THREE.Vector2(0, 0),
      width: 1,
      height: meshHeight / meshWidth
    });
  }

  /** ビューにモデルを反映させる */
  gameLoop(model: BatteryGaugeModel): void {
    if(this._isChanged(this._modelCache, model)) {
      this._refreshGauge(model);
    }
    this._modelCache = model;
    this._refreshPos();
  }

  /**
   * モデルが変更されたか否かを判定する
   *
   * @param model 更新前のモデル
   * @param newModel 更新されたモデル
   * @return 判定結果、trueで変更された
   */
  _isChanged(model: BatteryGaugeModel, newModel: BatteryGaugeModel): boolean {
    return model.battery !== newModel.battery || model.maxBattery !== newModel.maxBattery;
  }

  /**
   * ゲージを更新する
   *
   * @param model HPゲージモデル
   */
  _refreshGauge(model: BatteryGaugeModel): void {
    this.draw((context: CanvasRenderingContext2D) => {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // UVマッピングの原点は左下なので、HPゲージがテクスチャの一番下に描画されるようにする
      drawEnemyBatteryGauge(context, this.resources, context.canvas.width/2, context.canvas.height - 32, model.battery);
    });
  }

  /** 表示位置を更新する */
  _refreshPos(): void {
    this.mesh.position.x = (-window.innerWidth + this.meshWidth) / 2;
    this.mesh.position.y = window.innerHeight / 2 - 96;
  }
}