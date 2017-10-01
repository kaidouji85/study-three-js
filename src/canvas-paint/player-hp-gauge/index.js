// @flow
import type {Resources} from '../../common/resource-manager';
import {CANVAS_PICTURE_PATH} from '../../common/resource-manager';
import {drawImage} from '../../common/canvas-image-drawer';
import {PlayerHpBar} from './bar';
import {drawNumberLeft} from '../../common/canvas-number-drawe';

/**
 * HPゲージを描画する
 * ローカル座標の原点は中心
 *
 * @param context Canvasコンテキスト
 * @param resources リソース管理オブジェクト
 * @param dx 描画X
 * @param dy 描画Y
 * @param hp 現在のHP
 * @param maxHP 最大HP
 */
export function PlayerHpGauge(context: CanvasRenderingContext2D, resources: Resources, dx: number, dy: number, hp: number, maxHp: number) {
  drawImage(context, resources, CANVAS_PICTURE_PATH.PLAYER_HP_GAUGE_BASE, dx, dy);
  const value = hp / maxHp;
  PlayerHpBar(context, resources, dx-8, dy+8, value);
  drawNumberLeft(context, resources, CANVAS_PICTURE_PATH.HP_NUMBER, dx - 100, dy - 24, hp);
}