// @flow

import type {MyTurnAnimationParam, MyTurnAnimationParamX} from "./animation-param";
import {NeoLandozerTD} from "../../view/td/armdozer-objects/neo-landozer";
import {NeoLandozerHUD} from "../../view/hud/armdozer-objects/neo-landozer";
import {all} from "../../../../../animation/all";
import {dolly, toInitial, track} from "../td-camera";
import {delay} from "../../../../../animation/delay";
import {Animate} from "../../../../../animation/animate";

/**
 * ネオランドーザ マイターン パラメータ
 */
export type NeoLandozerMyTurn = MyTurnAnimationParamX<NeoLandozerTD, NeoLandozerHUD>;

/**
 * ネオランドーザ マイターン パラメータにキャストする
 * キャストできない場合はnullを返す
 *
 * @param origin キャスト元
 * @return キャスト結果
 */
export function castNeoLandozerMyTurn(origin: MyTurnAnimationParam): ?NeoLandozerMyTurn {
  if ((origin.tdArmdozer instanceof NeoLandozerTD) && (origin.hudArmdozer instanceof NeoLandozerHUD)) {
    const td: NeoLandozerTD = origin.tdArmdozer;
    const hud: NeoLandozerHUD = origin.hudArmdozer;
    return ((origin: any): MyTurnAnimationParamX<typeof td, typeof hud>);
  }
  return null;
}

/**
 * ネオランドーザ マイターン アニメーション
 *
 * @param param パラメータ
 * @param effects 各種効果アニメーション
 * @return アニメーション
 */
export function neoLandozerMyTurn(param: NeoLandozerMyTurn, effects: Animate): Animate {
  return all(
    all(
      track(param.tdCamera, param.tdArmdozer.sprite().getObject3D().position.x, 500),
      dolly(param.tdCamera, '-40', 500),
      param.tdArmdozer.neoLandozer.guts()
        .chain(delay(1200)),
      param.hudPlayer.turnStart.show(),
    )
      .chain(all(
        toInitial(param.tdCamera, 500),
        param.tdArmdozer.neoLandozer.gutsToStand(),
        param.hudPlayer.turnStart.hidden(),
      ))
      .chain(delay(500)),

    delay(700)
      .chain(effects),
  );
}
