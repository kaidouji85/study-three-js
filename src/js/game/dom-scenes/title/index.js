/// @flow

import {createInitialState} from "./state/initial-state";
import type {TitleState} from "./state/title-state";
import {Observable, Subject, Subscription} from "rxjs";
import type {PushGameStart, PushHowToPlay} from "../../../action/game/title";
import {TitleView} from "./view/title-view";
import type {DOMScene} from "../dom-scene";
import type {Resources} from "../../../resource";
import {Howl} from 'howler';
import {SOUND_IDS} from "../../../resource/sound";

/** イベント通知 */
export type Notifier = {
  pushGameStart: Observable<PushGameStart>,
  pushHowToPlay: Observable<PushHowToPlay>,
};

/** タイトルシーン */
export class Title implements DOMScene {
  _state: TitleState;
  _view: TitleView;
  _pushButton: typeof Howl;
  _pushGameStart: Subject<PushGameStart>;
  _pushHowToPlay: Subject<PushHowToPlay>;
  _subscriptions: Subscription[];

  /**
   * コンストラクタ
   *
   * @param resources リソース管理オブジェクト
   */
  constructor(resources: Resources) {
    this._state = createInitialState();
    this._view = new TitleView(resources);

    const pushButtonResource = resources.sounds.find(v => v.id === SOUND_IDS.PUSH_BUTTON);
    this._pushButton = pushButtonResource
      ? pushButtonResource.sound
      : new Howl();

    this._pushGameStart = new Subject();
    this._pushHowToPlay = new Subject();
    this._subscriptions = [
      this._view.notifier().gameStart.subscribe(() => {
        this._onPushGameStart();
      }),
      this._view.notifier().howToPlay.subscribe(() => {
        this._onPushHowToPlay();
      })
    ];
  }

  /**
   * デストラクタ相当の処理
   */
  destructor(): void {
    this._subscriptions.forEach(v => {
      v.unsubscribe();
    });
  }

  /**
   * 各種リソースの読み込みが完了するまで待つ
   *
   * @return 待機結果
   */
  waitUntilLoaded(): Promise<void> {
    return this._view.waitUntilLoaded();
  }

  /** イベント通知ストリーム */
  notifier(): Notifier {
    return {
      pushGameStart: this._pushGameStart,
      pushHowToPlay: this._pushHowToPlay,
    };
  }

  /**
   * ルートHTML要素を取得する
   *
   * @return {HTMLElement}
   */
  getRootHTMLElement(): HTMLElement {
    return this._view.getRootHTMLElement();
  }

  /**
   * ゲームスタートが押された際の処理
   */
  async _onPushGameStart(): Promise<void> {
    if (!this._state.canOperation) {
      return;
    }

    this._state.canOperation = false;
    this._pushButton.play();
    await this._view.pushGameStartButton();
    this._pushGameStart.next({
      type: 'PushGameStart'
    });
  }

  /**
   * 遊び方が押された際の処理
   */
  async _onPushHowToPlay(): Promise<void> {
    if (!this._state.canOperation) {
      return;
    }

    this._state.canOperation = false;
    this._view.pushHowToPlayButton();
    this._pushHowToPlay.next({
      type: 'PushHowToPlay'
    });
    this._state.canOperation = true;
  }
}
