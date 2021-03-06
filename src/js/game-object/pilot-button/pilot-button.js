// @flow

import * as THREE from 'three';
import type {Resources} from "../../resource";
import {PilotButtonView} from "./view/pilot-button-view";
import type {PilotButtonModel} from "./model/pilot-button-model";
import {createInitialValue} from './model/initial-value';
import type {PreRender} from "../../game-loop/pre-render";
import {Animate} from "../../animation/animate";
import {open} from "./animation/open";
import {decide} from "./animation/decide";
import {close} from "./animation/close";
import {PilotButtonSounds} from "./sounds/pilot-button-sounds";
import type {GameObjectAction} from "../action/game-object-action";
import type {Stream, Unsubscriber} from "../../stream/core";
import type {PilotIcon} from "./view/pilot-icon";
import {filter} from "../../stream/operator";

/**
 * パイロットボタン
 */
export class PilotButton {
  _model: PilotButtonModel;
  _sounds: PilotButtonSounds;
  _view: PilotButtonView;
  _pushButton: Stream<void>;
  _unsubscriber: Unsubscriber;

  /**
   * コンストラクタ
   *
   * @param resources リソース管理オブジェクト
   * @param pilotIcon パイロットアイコン
   * @param listener イベントリスナ
   */
  constructor(resources: Resources, pilotIcon: PilotIcon, listener: Stream<GameObjectAction>) {
    this._model = createInitialValue();
    this._sounds = new PilotButtonSounds(resources);
    this._view = new PilotButtonView(resources, pilotIcon, listener);

    this._pushButton = this._view.pushButtonNotifier()
      .chain(filter(() => !this._model.disabled && this._model.canPilot));
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
   * パイロットボタン を表示する
   *
   * @param canPilot ボタン利用フラグ、trueで利用可能
   * @return アニメーション
   */
  open(canPilot: boolean): Animate {
    return open(this._model, canPilot);
  }

  /**
   * ボタンクリック
   *
   * @return アニメーション
   */
  decide(): Animate {
    return decide(this._model, this._sounds);
  }

  /**
   * パイロットボタンを非表示にする
   *
   * @return アニメーション
   */
  close(): Animate {
    return close(this._model);
  }

  /**
   * ボタン押下通知
   * @return 通知ストリーム
   */
  pushButtonNotifier(): Stream<void> {
    return this._pushButton;
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