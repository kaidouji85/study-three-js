// @flow

import {Howl} from 'howler';
import type {DOMScene} from "../dom-scene";
import {Observable, Subject, Subscription} from "rxjs";
import type {EndNPCEnding} from "../../../action/game/npc-ending";
import {NPCEndingView} from "./view/npc-ending-view";
import type {NPCEndingState} from "./state/npc-ending-state";
import {createInitialState} from "./state/initial-state";
import type {Resources} from "../../../resource";
import {SOUND_IDS} from "../../../resource/sound";

/** イベント通知 */
type Notifier  = {
  endNpcEnding: Observable<EndNPCEnding>
};

/**
 * NPCルート エンディング
 */
export class NPCEnding implements DOMScene {
  _state: NPCEndingState;
  _view: NPCEndingView;
  _pushButtonSound: Howl;
  _endNPCEnding: Subject<EndNPCEnding>;
  _subsctiptoons: Subscription[];

  /**
   * コンストラクタ
   *
   * @param resources リソース管理オブジェクト
   */
  constructor(resources: Resources) {
    this._state = createInitialState();
    this._endNPCEnding = new Subject();
    this._view = new NPCEndingView(resources.path);

    const pushButtonResource = resources.sounds.find(v => v.id === SOUND_IDS.PUSH_BUTTON);
    this._pushButtonSound = pushButtonResource
      ? pushButtonResource.sound
      : new Howl();

    this._subsctiptoons = [
      this._view.notifier().screenPush.subscribe(() => {
        this._onScreenPush();
      })
    ];
  }

  /**
   * デストラクタ相当の処理
   */
  destructor(): void {
    this._view.destructor();
  }

  /**
   * ルートHTML要素を取得する
   *
   * @return 取得結果
   */
  getRootHTMLElement(): HTMLElement {
    return this._view.getRootHTMLElement();
  }

  /**
   * イベント通知
   *
   * @return イベント通知ストリーム
   */
  notifier(): Notifier {
    return {
      endNpcEnding: this._endNPCEnding
    };
  }

  /**
   * 各種リソースの読み込みが完了するまで待つ
   *
   * @return 待機結果
   */
  waitUntilLoaded(): Promise<void> {
    return this._view.waitUntilLoaded();
  }

  /**
   * 画面がクリックされた際の処理
   */
  _onScreenPush(): void {
    if (!this._state.canOperate) {
      return;
    }
    
    this._state.canOperate = false;
    this._pushButtonSound.play();
    this._endNPCEnding.next();
  }
}