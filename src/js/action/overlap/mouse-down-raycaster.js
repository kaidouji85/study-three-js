// @flow
import type {MouseRaycaster} from "../../raycaster/mouse/mouse-raycaster";
import {createMouseRaycaster} from "../../raycaster/mouse/mouse-raycaster";
import type {MouseDown} from "../dom-event/mouse";
import * as THREE from "three";

/** マウスダウンレイキャスター*/
export type MouseDownRaycaster = {
  type: 'mouseDownRaycaster',
  mouse: MouseRaycaster
};

/**
 * MouseDownからMouseDownRaycasterに変換
 *
 * @param origin 変換元
 * @return 変換結果
 */
export function toMouseDownRaycaster(origin: MouseDown, renderer: THREE.WebGLRenderer, camera: THREE.Camera): MouseDownRaycaster {
  const mouseRaycaster: MouseRaycaster = createMouseRaycaster(origin.event, renderer, camera);
  return {
    type: 'mouseDownRaycaster',
    mouse: mouseRaycaster
  };
}