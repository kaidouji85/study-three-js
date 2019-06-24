// @flow

import {ArmDozerSprite} from '../armdozer-sprite';
import * as THREE from "three";
import type {ShinBraverView} from "./view/shin-braver-view";
import {Observable} from "rxjs";
import type {GameObjectAction} from "../../../action/game-object-action";
import type {ShinBraverModel} from "./model/shin-braver-model";
import {createInitialValue} from "./model/initial-value";
import type {Update} from "../../../action/game-loop/update";
import type {PreRender} from "../../../action/game-loop/pre-render";
import {Animate} from "../../../animation/animate";
import {straightPunch} from "./animation/straight-punch";
import {knockBack} from "./animation/knock-back";
import {knockBackToStand} from "./animation/knock-back-to-stand";
import {avoid} from "./animation/avoid";
import {guard} from "./animation/guard";
import {guardToStand} from "./animation/guard-to-stand";
import {avoidToStand} from "./animation/avoid-to-stand";

/** シンブレイバーのゲームオブジェクト */
export class ShinBraver implements ArmDozerSprite {
  _model: ShinBraverModel;
  _view: ShinBraverView;

  constructor(params: { view: ShinBraverView, listener: Observable<GameObjectAction> }) {
    this._model = createInitialValue();
    this._view = params.view;

    params.listener.subscribe(action => {
      if (action.type === 'Update') {
        this._update(action);
      } else if (action.type === 'PreRender') {
        this._preRender(action);
      }
    });
  }

  /** ストレートパンチ */
  straightPunch(): Animate {
    return straightPunch(this._model);
  }

  /** ダメージアニメーションを再生する */
  knockBack(): Animate {
    return knockBack(this._model);
  }

  /** ノックバック -> 立ち */
  knockBackToStand(): Animate {
    return knockBackToStand(this._model);
  }

  /** ガード */
  guard(): Animate {
    return guard(this._model);
  }

  /** ガード -> 立ちポーズ */
  guardToStand(): Animate {
    return guardToStand(this._model);
  }

  /** 避け */
  avoid(): Animate {
    return avoid(this._model);
  }

  /** 避け -> 立ち */
  avoidToStand(): Animate {
    return avoidToStand(this._model);
  }

  /** シーンに追加するオブジェクトを返す */
  getObject3D(): THREE.Object3D {
    return this._view.getObject3D();
  }

  /** 状態更新 */
  _update(action: Update): void {
    this._view.engage(this._model);
  }

  /** レンダリング直前の処理 */
  _preRender(action: PreRender): void {
    this._view.lookAt(action.camera);
  }
}