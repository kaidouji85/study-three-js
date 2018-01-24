// @flow

import {ThreeDimensionLayerStubBase} from "../util/three-dimension-layer-stub";
import {ShinBraver} from "../../src/game-object/armdozer/shin-breaver/shin-breaver";
import type {Resources} from "../../src/resource/resource-manager";
import {PlayerShinBraver} from "../../src/game-object/armdozer/shin-breaver";
import * as THREE from "three";

new ThreeDimensionLayerStubBase({
  resourceBashPath: '../resources/',
  init(resources: Resources): ShinBraver {
    const shinBraver = new PlayerShinBraver(resources);

    return shinBraver;
  },
  addScene(scene: THREE.Scene, gameObject: ShinBraver): void {
    gameObject.getThreeJsObjects().forEach(v => scene.add(v));
  },
  gameLoop(time: DOMHighResTimeStamp, camera: THREE.Camera, gameObject: ShinBraver): void {
    gameObject.gameLoop(camera, time);
  }
});