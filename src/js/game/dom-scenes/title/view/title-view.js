// @flow

import {domUuid} from "../../../../uuid/dom-uuid";
import {Observable, Subject} from "rxjs";
import {waitFinishAnimation} from "../../../../wait/wait-finish-animation";
import type {Resources} from "../../../../resource";
import {PathIds} from "../../../../resource/path";

/** イベント通知 */
type Notifier = {
  gameStart: Observable<void>,
  howToPlay: Observable<void>,
};

/** タイトルビュー */
export class TitleView {
  _gameStartStream: Subject<void>;
  _howToPlayStream: Subject<void>;

  _root: HTMLElement;
  _gameStart: HTMLElement;
  _howToPlay: HTMLElement;

  _isTitleBackLoaded: Promise<void>;
  _isLogoLoaded: Promise<void>;

  /**
   * コンストラクタ
   *
   * @param resources リソース管理オブジェクト
   */
  constructor(resources: Resources) {
    this._gameStartStream = new Subject();
    this._howToPlayStream = new Subject();

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
    this._root.className = 'title';
    const titleBackImage = new Image();
    this._isTitleBackLoaded = new Promise(resolve => {
      titleBackImage.addEventListener('load', () => {
        this._root.style.backgroundImage = `url(${titleBackImage.src})`;
        resolve();
      });
    });
    const titleBackResource = resources.paths.find(v => v.id === PathIds.TITLE_BACK);
    titleBackImage.src = titleBackResource
      ? titleBackResource.path
      : '';

    const logo = this._root.querySelector(`[data-id="${logoId}"]`);
    const logoImage: HTMLImageElement = (logo instanceof HTMLImageElement)
      ? logo
      : new Image();
    this._isLogoLoaded = new Promise(resolve => {
      logoImage.addEventListener('load', () => {
        resolve();
      });
    });
    const logoResource = resources.paths.find(v => v.id === PathIds.LOGO);
    logoImage.src = logoResource
      ? logoResource.path
      : '';

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
    await Promise.all([
      this._isTitleBackLoaded,
      this._isLogoLoaded,
    ]);
  }

  /**
   * ゲームスタートボタンを押した際のアニメーション
   *
   * @return アニメーション
   */
  async pushGameStartButton(): Promise<void> {
    const animation = this._gameStart.animate([
      {transform: 'scale(1)'},
      {transform: 'scale(1.1)'},
      {transform: 'scale(1)'},
    ], {
      duration: 200,
      fill: "forwards",
      easing: 'ease'
    });
    await waitFinishAnimation(animation);
  }

  /**
   * 遊び方ボタンを押した際のアニメーション
   *
   * @return アニメーション
   */
  async pushHowToPlayButton(): Promise<void> {
    const animation = this._howToPlay.animate([
      {transform: 'scale(1)'},
      {transform: 'scale(1.1)'},
      {transform: 'scale(1)'},
    ], {
      duration: 200,
      fill: "forwards",
      easing: 'ease'
    });
    await waitFinishAnimation(animation);
  }
}