// @flow

import TWEEN from "@tweenjs/tween.js";
import type {Resources} from '../../../../resource';
import {ThreeDimensionLayer} from './td';
import {HudLayer} from './hud';
import type {Player, PlayerId} from "gbraver-burst-core";
import type {GameLoop} from "../../../../action/game-loop/game-loop";
import {Observable, Subject} from "rxjs";
import type {TdDOMEvent} from "../../../../action/td-dom";
import type {BattleSceneAction} from "../action";
import type {Render} from "../../../../action/game-loop/render";
import type {SafeAreaInset} from "../../../../safe-area/safe-area-inset";
import {createSafeAreaInset} from "../../../../safe-area/safe-area-inset";
import type {Resize} from "../../../../action/resize/resize";
import type {Update} from "../../../../action/game-loop/update";
import type {PreRender} from "../../../../action/game-loop/pre-render";
import {tracking} from "./tracking";

/** コンストラクタのパラメータ */
type Param = {
  resources: Resources,
  rendererDOM: HTMLElement,
  playerId: PlayerId,
  players: Player[],
  listener: {
    gameLoop: Observable<GameLoop>,
    domEvent: Observable<TdDOMEvent>,
    resize: Observable<Resize>,
  }
};

/** 戦闘シーンビューのイベント通知 */
type Notifier = {
  render: Observable<Render>,
  battleAction: Observable<BattleSceneAction>,
};

/**
 * 戦闘画面のビュー
 */
export class BattleSceneView {
  td: ThreeDimensionLayer;
  hud: HudLayer;
  _playerId: PlayerId;
  _safeAreaInset: SafeAreaInset;
  _rendererDOM: HTMLElement;
  _rendering: Subject<Render>;
  _updateTD: Subject<Update>;
  _preRenderTD: Subject<PreRender>;
  _updateHUD: Subject<Update>;
  _preRenderHUD: Subject<PreRender>;

  constructor(param: Param) {
    this._playerId = param.playerId;
    this._safeAreaInset = createSafeAreaInset();
    this._rendererDOM = param.rendererDOM;
    this._rendering = new Subject();
    this._updateTD = new Subject();
    this._preRenderTD = new Subject();
    this._updateHUD = new Subject();
    this._preRenderHUD = new Subject();

    this.td = new ThreeDimensionLayer({
      resources: param.resources,
      rendererDOM: param.rendererDOM,
      safeAreaInset: this._safeAreaInset,
      playerId: param.playerId,
      players: param.players,
      listener: {
        domEvent: param.listener.domEvent,
        resize: param.listener.resize,
        update: this._updateTD,
        preRender: this._preRenderTD,
      }
    });

    this.hud = new HudLayer({
      resources: param.resources,
      rendererDOM: param.rendererDOM,
      playerId: param.playerId,
      players: param.players,
      listener: {
        domEvent: param.listener.domEvent,
        resize: param.listener.resize,
        update: this._updateHUD,
        preRender: this._preRenderHUD,
      }
    });

    param.listener.gameLoop.subscribe(action => {
      this._gameLoop(action);
    });
  }

  /**
   * デストラクタ相当の処理
   */
  destructor(): void {
    this.hud.destructor();
    this.td.destructor();
  }

  /**
   * イベント通知ストリームを取得する
   *
   * @return イベント通知ストリーム
   */
  notifier(): Notifier {
    return {
      render: this._rendering,
      battleAction: this.hud.notifier().battleAction,
    };
  }

  /**
   * ゲームループ
   *
   * @param action アクション
   */
  _gameLoop(action: GameLoop): void {
    TWEEN.update(action.time);

    this._updateTD.next({
      type: 'Update',
      time: action.time
    });
    this._preRenderTD.next({
      type: 'PreRender',
      camera: this.td.camera.getCamera(),
      rendererDOM: this._rendererDOM,
      safeAreaInset: this._safeAreaInset,
    });
    this._rendering.next({
      type: 'Render',
      scene: this.td.scene,
      camera: this.td.camera.getCamera()
    });

    this._updateHUD.next({
      type: 'Update',
      time: action.time
    });
    tracking(this.td, this.hud, this._playerId, this._rendererDOM);
    this._preRenderHUD.next({
      type: 'PreRender',
      camera: this.hud.camera.getCamera(),
      rendererDOM: this._rendererDOM,
      safeAreaInset: this._safeAreaInset,
    });
    this._rendering.next({
      type: 'Render',
      scene: this.hud.scene,
      camera: this.hud.camera.getCamera()
    });
  }
}
