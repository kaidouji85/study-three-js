// @flow
import * as THREE from 'three';
import type {Resources} from '../../../../../resource';
import type {Player} from "gbraver-burst-core";
import type {BattleSceneAction} from "../../actions";
import type {Update} from "../../../../../game-loop/update";
import type {PreRender} from "../../../../../game-loop/pre-render";
import {PlainHUDCamera} from "../../../../../game-object/camera/plain-hud";
import {HUDGameObjects} from "./game-objects";
import type {OverlapEvent} from "../../../../../render/overlap-event/overlap-event";
import {gameObjectStream} from "../../../../../game-object/action/game-object-action";
import type {Resize} from "../../../../../window/resize";
import {enemyArmdozerHUD, playerArmdozerHUD} from "./armdozer-objects";
import {enemyHUDObjects, HUDPlayer, playerHUDObjects} from "./player";
import {enemyHUDPilotObjects, playerHUDPilotObjects} from "./pilot-objects";
import type {HUDPilotObjects} from "./pilot-objects/hud-pilot-objects";
import type {HUDArmdozerObjects} from "./armdozer-objects/hud-armdozer-ibjects";
import type {GameObjectAction} from "../../../../../game-object/action/game-object-action";
import type {OverlapNotifier} from "../../../../../render/overla-notifier";
import type {Stream} from "../../../../../stream/core";

/** コンストラクタのパラメータ */
export type Param = {
  resources: Resources,
  renderer: OverlapNotifier,
  player: Player,
  enemy: Player,
  update: Stream<Update>,
  preRender: Stream<PreRender>,
  resize: Stream<Resize>,
};

/**
 * HUDレイヤーで使用するオブジェクトを全て集めたもの
 */
export class HudLayer {
  scene: typeof THREE.Scene;
  camera: PlainHUDCamera;
  players: HUDPlayer[];
  armdozers: HUDArmdozerObjects[];
  pilots: HUDPilotObjects[];
  gameObjects: HUDGameObjects;
  _overlap: Stream<OverlapEvent>;
  _gameObjectAction: Stream<GameObjectAction>;

  constructor(param: Param) {
    this.scene = new THREE.Scene();
    this.camera = new PlainHUDCamera(param.resize);

    this._overlap = param.renderer.createOverlapNotifier(this.camera.getCamera());
    this._gameObjectAction = gameObjectStream(param.update, param.preRender, this._overlap);
    this.gameObjects = new HUDGameObjects(param.resources, this._gameObjectAction, param.player);
    this.gameObjects.getObject3Ds().forEach(object => {
      this.scene.add(object);
    });

    this.players = [
      playerHUDObjects(param.resources, param.player, this._gameObjectAction),
      enemyHUDObjects(param.resources, param.enemy, this._gameObjectAction)
    ];
    this.players.map(v => v.getObject3Ds())
      .flat()
      .forEach(v => {
        this.scene.add(v);
      });

    this.armdozers = [
      playerArmdozerHUD(param.resources, this._gameObjectAction, param.player),
      enemyArmdozerHUD(param.resources, this._gameObjectAction, param.enemy)
    ];
    this.armdozers.map(v => v.getObject3Ds())
      .flat()
      .forEach(v => {
        this.scene.add(v);
      });

    this.pilots = [
      playerHUDPilotObjects(param.resources, this._gameObjectAction, param.player),
      enemyHUDPilotObjects(param.resources, this._gameObjectAction, param.enemy)
    ];
    this.pilots.map(v => v.getObject3Ds())
      .flat()
      .forEach(v => {
        this.scene.add(v);
      });
  }

  /** デストラクタ */
  destructor(): void {
    const removeTargets: typeof THREE.Object3D[] = [
      ...this.gameObjects.getObject3Ds(),
      ...this.armdozers.flatMap(v => v.getObject3Ds()),
      ...this.players.flatMap(v => v.getObject3Ds()),
      ...this.pilots.flatMap(v => v.getObject3Ds()),
    ];
    removeTargets.forEach(v => {
      this.scene.remove(v);
    });

    this.gameObjects.destructor();
    this.armdozers.forEach(armdozer => {
      armdozer.destructor();
    });
    this.players.forEach(player => {
      player.destructor();
    });
    this.pilots.forEach(pilot => {
      pilot.destructor();
    })
    this.camera.destructor();
  }

  /**
   * 戦闘シーンアクション通知
   * @return 通知ストリーム
   */
  battleActionNotifier(): Stream<BattleSceneAction> {
    return this.gameObjects.battleActionNotifier();
  }
}