// @flow

import type {TitleState} from "../state/title-state";
import {domUuid} from "../../../../uuid/dom-uuid";
import {Observable, Subject} from "rxjs";
import type {ResourcePath} from "../../../../resource/path/resource-path";
import {titleBackURL, titleLogoURL} from "../../../../resource/urls/title-urls";

/** イベント通知 */
type Notifier = {
  gameStart: Observable<void>,
  howToPlay: Observable<void>,
};

/** コンストラクタのパラメータ */
type Params = {
  /** 初期状態 */
  initialState: TitleState,
  /** リソースパス */
  resourcePath: ResourcePath,
};

/** タイトルビュー */
export class TitleView {
  _gameStartStream: Subject<void>;
  _howToPlayStream: Subject<void>;
  _root: HTMLElement;
  _logo: HTMLImageElement;
  _isLogoLoaded: Promise<void>;
  _gameStart: HTMLElement;
  _howToPlay: HTMLElement;
  _imageURLs: {
    titleLogo: string,
    titleBack: string
  };

  constructor(params: Params) {
    this._gameStartStream = new Subject();
    this._howToPlayStream = new Subject();

    this._imageURLs = {
      titleLogo: titleLogoURL(params.resourcePath),
      titleBack: titleBackURL(params.resourcePath)
    };

    this._root = document.createElement('div');

    const logoId = domUuid();
    const gameStartId = domUuid();
    const howToPlayId = domUuid();
    this._root.innerHTML = `
      <div class="title__contents">
        <img class="title__contents__logo" data-id="${logoId}" />
        <div class="title__contents__copy-rights">
          <span class="title__contents__copy-rights__row">(C) 2020 Yuusuke Takeuchi</span>
        </div>
        <div class="title__contents__controllers">
          <button class="title__contents__controllers__game-start" data-id="${gameStartId}" >ゲームスタート</button>
          <button class="title__contents__controllers__how-to-play" data-id="${howToPlayId}">遊び方</button>
        </div>
      </div>
    `;
    this._root.style.backgroundImage = `url(${this._imageURLs.titleBack})`;
    this._root.className = 'title';

    const logoSearch = this._root.querySelector(`[data-id="${logoId}"]`);
    this._logo = (logoSearch instanceof HTMLImageElement)
      ? logoSearch
      : new Image();
    this._isLogoLoaded = new Promise(resolve => {
      this._logo.addEventListener('load', () => {
        resolve();
      });
    });
    this._logo.src = titleLogoURL(params.resourcePath);

    this._gameStart = this._root.querySelector(`[data-id="${gameStartId}"]`) || document.createElement('div');
    this._gameStart.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      this._gameStartStream.next();
    });
    this._gameStart.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault();
      this._gameStartStream.next();
    });

    this._howToPlay = this._root.querySelector(`[data-id="${howToPlayId}"]`) || document.createElement('div');
    this._howToPlay.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      this._howToPlayStream.next();
    });
    this._howToPlay.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault();
      this._howToPlayStream.next();
    });
  }

  /**
   * イベント通知ストリームを取得する
   *
   * @return イベント通知ストリーム
   */
  notifier(): Notifier {
    return {
      gameStart: this._gameStartStream,
      howToPlay: this._howToPlayStream,
    };
  }

  /**
   * ルートHTML要素を取得する
   *
   * @return 取得結果
   */
  getRootHTMLElement(): HTMLElement {
    return this._root;
  }

  /**
   * 各種リソースの読み込みが完了するまで待つ
   *
   * @return 待機結果
   */
  async waitUntilLoaded(): Promise<void> {
    return this._isLogoLoaded;
  }
}