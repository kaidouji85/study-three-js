// @flow

import * as THREE from 'three';
import type {ShinBraverCutInModel} from "./model/shin-braver-cutin-model";
import type {ShinBraverCutInView} from "./view/shin-braver-cutin-view";
import {createInitialValue} from "./model/initial-value";
import {Animate} from "../../../animation/animate";
import {hidden} from "./animation/hidden";
import type {PreRender} from "../../../game-loop/pre-render";
import {show} from "./animation/show";
import type {HUDTracking} from "../../../tracking/hud-tracking";
import type {GameObjectAction} from "../../action/game-object-action";
import type {Stream, Unsubscriber} from "../../../stream/core";

/**
 * シンブレイバーカットイン
 */
export class ShinBraverCutIn implements HUDTracking {
  _model: ShinBraverCutInModel;
  _view: ShinBraverCutInView;
  _unsubscriber: Unsubscriber;

  constructor(view: ShinBraverCutInView, listener: Stream<GameObjectAction>) {
    this._model = createInitialValue();
    this._view = view;
    this._unsubscriber = listener.subscribe(action => {
      if (action.type === 'PreRender') {
        this._onPreRender(action);
      }
    });
  }

  /**
   * デストラクタ相当の処理
   */
  destructor(): void {
    this._view.destructor();
    this._unsubscriber.unsubscribe();
  }

  /**
   * シーンに追加するオブジェクトを取得する
   *
   * @return シーンに追加するオブジェクト
   */
  getObject3D(): typeof THREE.Object3D {
    return this._view.getObject3D();
  }

  /**
   * 3Dレイヤーのオブジェクトをトラッキングする
   * 本メソッドにはHUDレイヤー系座標をセットすること
   *
   * @param x x座標
   * @param y y座標
   */
  tracking(x: number, y: number): void {
    this._model.tracking.x = x;
    this._model.tracking.y = y;
  }

  /**
   * カットインを表示する
   *
   * @return アニメーション
   */
  show(): Animate {
    return show(this._model);
  }

  /**
   * カットインを非表示にする
   *
   * @return {Animate}
   */
  hidden(): Animate {
    return hidden(this._model);
  }

  /**
   * プリレンダー時の処理
   *
   * @param action アクション
   */
  _onPreRender(action: PreRender): void {
    this._view.engage(this._model, action);
  }
}