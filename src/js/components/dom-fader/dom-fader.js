// @flow

import {waitFinishAnimation} from "../../wait/wait-finish-animation";

/**
 * HTML要素で作られたフェーダ
 */
export class DOMFader {
  _root: HTMLElement;

  /**
   * コンストラクタ
   */
  constructor() {
    this._root = document.createElement('div');
    this._root.className = 'dom-fader';
  }

  /**
   * ルートのHTML要素を取得する
   *
   * @return 取得結果
   */
  getRootHTMLElement(): HTMLElement {
    return this._root;
  }

  /**
   * フェーダーを即座に消す
   */
  hidden(): void {
    this._root.style.display = 'none';
  }

  /**
   * フェードイン
   *
   * @return アニメーション
   */
  async fadeIn(): Promise<void> {
    this._root.style.display = 'block';

    const animation = this._root.animate([
      {opacity: 1, display: 'block'},
      {opacity: 0, display: 'none'}
    ], {
      duration: 500,
      fill: "forwards",
      easing: 'ease'
    });
    await waitFinishAnimation(animation);

    this._root.style.display = 'none';
  }

  /**
   * フェードアウト
   *
   * @return アニメーション
   */
  async fadeOut(): Promise<void> {
    this._root.style.display = 'block';

    const animation = this._root.animate([
      {opacity: 0},
      {opacity: 1}
    ], {
      duration: 500,
      fill: "forwards",
      easing: 'ease'
    });
    await waitFinishAnimation(animation);
  }
}
