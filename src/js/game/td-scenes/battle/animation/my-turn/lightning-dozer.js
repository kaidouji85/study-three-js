// @flow

import type {MyTurnAnimationParam, MyTurnAnimationParamX} from "./animation-param";
import {LightningDozerTD} from "../../view/td/armdozer-objects/lightning-dozer";
import {LightningDozerHUD} from "../../view/hud/armdozer-objects/lightning-dozer";
import {Animate} from "../../../../../animation/animate";
import {all} from "../../../../../animation/all";
import {dolly, toInitial, track} from "../td-camera";
import {delay} from "../../../../../animation/delay";

/**
 * ライトニングドーザ マイターン パラメータ
 */
export type LightningDozerMyTurn = MyTurnAnimationParamX<LightningDozerTD, LightningDozerHUD>;

/**
 * ライトニングドーザ マイターン パラメータにキャストする
 * キャストできない場合はnullを返す
 *
 * @param origin キャスト元
 * @return キャスト結果
 */
export function castLightningDozerMyTurn(origin: MyTurnAnimationParam): ?LightningDozerMyTurn {
  if ((origin.tdArmdozer instanceof LightningDozerTD) && (origin.hudArmdozer instanceof LightningDozerHUD)) {
    const td: LightningDozerTD = origin.tdArmdozer;
    const hud: LightningDozerHUD = origin.hudArmdozer;
    return ((origin: any): MyTurnAnimationParamX<typeof td, typeof hud>);
  }
  return null;
}

/**
 * ライトニングドーザ マイターン アニメーション
 *
 * @param param パラメータ
 * @param effects 各種効果アニメーション
 * @return アニメーション
 */
export function lightningDozerMyTurn(param: LightningDozerMyTurn, effects: Animate): Animate {
  return all(
    all(
      track(param.tdCamera, param.tdArmdozer.sprite().getObject3D().position.x, 500),
      dolly(param.tdCamera, '-40', 500),
      param.tdArmdozer.lightningDozer.guts()
        .chain(delay(1200)),
      param.hudPlayer.turnStart.show(),
    )
      .chain(all(
        toInitial(param.tdCamera, 500),
        param.tdArmdozer.lightningDozer.gutsToStand(),
        param.hudPlayer.turnStart.hidden(),
      ))
      .chain(delay(500)),

    delay(800)
      .chain(effects),
  );
}
