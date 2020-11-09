// @flow

import {Observable} from "rxjs";
import type {Resources} from "../../../../resource";
import type {PushDOM} from "../../../../action/push/push-dom";
import {pushDOMStream} from "../../../../action/push/push-dom";
import {waitElementLoaded} from "../../../../wait/wait-element-loaded";
import {pop} from "../../../../dom/animation/pop";

const ROOT_CLASS_NAME = 'player-select__pilot-icon';
const IMAGE_CLASS_NAME = `${ROOT_CLASS_NAME}__image`;

/**
 * パイロットアイコン
 */
export class PilotIcon {
  _root: HTMLElement;
  _image: HTMLImageElement;
  _isImageLoaded: Promise<void>;
  _select: Observable<PushDOM>;

  /**
   * コンストラクタ
   *
   * @param resources リソース管理オブジェクト
   * @param path 画像パス
   * @param alt 代替テキスト
   */
  constructor(resources: Resources, path: string, alt: string) {
    this._root = document.createElement('div');
    this._root.className = ROOT_CLASS_NAME;

    this._image = document.createElement('img');
    this._image.className = IMAGE_CLASS_NAME;
    this._isImageLoaded = waitElementLoaded(this._image);
    this._image.src = path;
    this._image.alt = alt;
    this._root.appendChild(this._image);

    this._select = pushDOMStream(this._image)
  }

  /**
   * リソース読み込みが完了するまで待つ
   *
   * @return 待機結果
   */
  waitUntilLoaded(): Promise<void> {
    return this._isImageLoaded;
  }

  /**
   * ルートHTMLを取得する
   *
   * @return 取得結果
   */
  getRootHTMLElement(): HTMLElement {
    return this._root;
  }

  /**
   * アイコン選択通知
   *
   * @return 通知ストリーム
   */
  selectedNotifier(): Observable<PushDOM> {
    return this._select;
  }

  /**
   * ポップアニメーション
   *
   * @return アニメーション
   */
  async pop(): Promise<void> {
    await pop(this._image);
  }
}