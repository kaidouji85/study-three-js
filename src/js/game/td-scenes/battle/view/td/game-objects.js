// @flow

import type {Stage} from "../../../../../game-object/stage/stage";
import {TurnIndicator} from "../../../../../game-object/turn-indicator/turn-indicator";
import type {Resources} from "../../../../../resource";
import {Observable} from "rxjs";
import type {GameObjectAction} from "../../../../../action/game-object-action";
import SchoolField from "../../../../../game-object/stage/shopping-street";
import * as THREE from "three";
import {SkyBrightness} from "../../../../../game-object/sky-brightness/sky-brightness";
import {Illumination} from "../../../../../game-object/illumination/illumination";

/** 3Dレイヤーのゲームオブジェクト フィールド */
interface TDGameObjectsField {
  stage: Stage;
  turnIndicator: TurnIndicator;
  skyBrightness: SkyBrightness;
  illumination: Illumination;
}

export class TDGameObjects implements TDGameObjectsField {
  stage: Stage;
  turnIndicator: TurnIndicator;
  skyBrightness: SkyBrightness;
  illumination: Illumination;

  constructor(param: TDGameObjectsField) {
    this.stage = param.stage;
    this.turnIndicator = param.turnIndicator;
    this.skyBrightness = param.skyBrightness;
    this.illumination = param.illumination;
  }

  /**
   * デストラクタ相当の処理
   *
   */
  destructor() {
    this.stage.destructor();
    this.turnIndicator.destructor();
    this.skyBrightness.destructor();
    this.illumination.destructor();
  }

  /**
   * シーンに追加するオブジェクトを取得する
   *
   * @return シーンに追加するオブジェクト
   */
  getObject3Ds(): THREE.Object3D[] {
    return [
      ...this.stage.getThreeJsObjects(),
      this.turnIndicator.getObject3D(),
      this.skyBrightness.getObject3D(),
      ...this.illumination.getObject3Ds()
    ];
  }
}

/**
 * 3Dレイヤーゲームオブジェクトを生成する
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @return 3Dレイヤーゲームオブジェクト
 */
export function createTDGameObjects(resources: Resources, listener: Observable<GameObjectAction>): TDGameObjects {
  const param = {
    stage: new SchoolField(resources),
    turnIndicator: new TurnIndicator({
      listener: listener,
      resources: resources
    }),
    skyBrightness: new SkyBrightness(listener),
    illumination: new Illumination(listener),
  };
  return new TDGameObjects(param);
}

// TODO 削除する
/**
 * 3Dレイヤーゲームオブジェクトをシーンに追加する
 *
 * @param scene 追加するシーン
 * @param target 3Dレイヤーゲームオブジェクト
 */
export function appendTDGameObjects(scene: THREE.Scene, target: TDGameObjects): void {
  target.stage.getThreeJsObjects()
    .forEach(item => scene.add(item));
  scene.add(target.turnIndicator.getObject3D());
  scene.add(target.skyBrightness.getObject3D());
  target.illumination.getObject3Ds().forEach(v => {
    scene.add(v);
  });
}

// TODO 削除する
/**
 * 3Dレイヤーゲームオブジェクトのリソースを破棄する
 *
 * @param target リソース破棄対象
 */
export function disposeTDGameObjects(target: TDGameObjects): void {
  target.stage.destructor();
  target.turnIndicator.destructor();
  target.skyBrightness.destructor();
  target.illumination.destructor();
}