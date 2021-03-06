// @flow

import {Animate} from "../../../../animation/animate";
import {TDCamera} from "../../../../game-object/camera/td";
import {all} from "../../../../animation/all";

/** カメラ初期位置 X */
export const INITIAL_CAMERA_POSITION_X: number = 0;
/** カメラ初期位置 Y */
export const INITIAL_CAMERA_POSITION_Y: number = 220;
/** カメラ初期位置 Z */
export const INITIAL_CAMERA_POSITION_Z: number = 300;

/** カメラ視点初期位置 X */
export const INITIAL_VIEW_POINT_X = 0;
/** カメラ視点初期位置 Y */
export const INITIAL_VIEW_POINT_Y = 200;
/** カメラ視点初期位置 Z */
export const INITIAL_VIEW_POINT_Z = 0;

/**
 * カメラを初期位置に戻す
 *
 * @param camera カメラ
 * @param duration アニメーション時間
 * @return アニメーション
 */
export function toInitial(camera: TDCamera, duration: number): Animate {
  return all(
    camera.moveCamera({
      x: INITIAL_CAMERA_POSITION_X,
      y: INITIAL_CAMERA_POSITION_Y,
      z: INITIAL_CAMERA_POSITION_Z
    }, duration),
    camera.moveViewPoint({
      x: INITIAL_VIEW_POINT_X,
      y: INITIAL_VIEW_POINT_Y,
      z: INITIAL_VIEW_POINT_Z,
    }, duration)
  );
}

/**
 * ドリー
 *
 * @param camera カメラ
 * @param z 移動量
 * @param duration 移動時間
 * @return アニメーション
 */
export function dolly(camera: TDCamera, z: number | string, duration: number): Animate {
  return all(
    camera.moveCamera({z: z}, duration),
    camera.moveViewPoint({z: z}, duration),
  );
}

/**
 * トラック
 *
 * @param camera カメラ
 * @param x 移動量
 * @param duration 移動時間
 * @return アニメーション
 */
export function track(camera: TDCamera, x: number | string, duration: number): Animate {
  return all(
    camera.moveCamera({x: x}, duration),
    camera.moveViewPoint({x: x}, duration),
  );
}
