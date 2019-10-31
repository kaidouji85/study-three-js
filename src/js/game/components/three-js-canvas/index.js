// @flow

import type {Resources} from "../../../resource";
import {Renderer} from "../../../game-object/renderer";
import {createRender} from "../../../render/create-render";
import {isDevelopment} from "../../../webpack/mode";
import {BoundSceneCache} from "./bind/bound-scene-cache";
import {bindBattleScene} from "./bind/bind-battle-scene";
import {ThreeJSCanvasStream} from "./stream";
import type {BattleRoom, InitialState} from "../../../battle-room/battle-room";
import {Observable} from "rxjs";
import type {GameAction} from "../../../action/game/game-action";

/** イベント通知 */
type Notifier = {
  gameAction: Observable<GameAction>
};

/** three.jsキャンバス全体を管理する */
export class ThreeJSCanvas {
  _stream: ThreeJSCanvasStream;
  _renderer: Renderer;
  _sceneCache: ?BoundSceneCache;

  constructor(parentDOM: HTMLElement) {
    this._stream = new ThreeJSCanvasStream();

    const threeJsRender = createRender();
    parentDOM.appendChild(threeJsRender.domElement);
    this._renderer = new Renderer({
      threeJsRender: threeJsRender,
      listener: {
        render: this._stream.render
      }
    });

    this._sceneCache = null;
  }

  /** デストラクタ相当の処理 */
  destructor(): void {
    this._sceneCache && this._sceneCache.destructor();
  }

  /**
   * イベント通知ストリームを取得する
   *
   * @return イベント通知ストリーム
   */
  notifier(): Notifier {
    return {
      gameAction: this._stream.gameAction
    };
  }

  /**
   * three.jsキャンバスに戦闘シーンを関連付ける
   *
   * @param resources リソース管理オブジェクト
   * @param room 戦闘ルーム
   * @param initialState 初期状態
   */
  bindBattleScene(resources: Resources, room: BattleRoom, initialState: InitialState): void {
    this._sceneCache && this._sceneCache.destructor();
    this._sceneCache = bindBattleScene(resources, this._renderer, this._stream, room, initialState);
    // デバッグ用にレンダラ情報をコンソールに出力
    if (isDevelopment()) {
      console.log(this._renderer.info());
    }
  }
}