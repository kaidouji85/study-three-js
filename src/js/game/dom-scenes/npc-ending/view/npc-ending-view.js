// @flow

import type {ResourcePath} from "../../../../resource/path/resource-path";

/**
 * NPCルート エンディング ビュー
 */
export class NPCEndingView {
  _root: HTMLElement;

  constructor(resourcePath: ResourcePath) {
    this._root = document.createElement('div');
    this._root.className = 'npc-ending';
    this._root.innerHTML = `
      <img class="npc-ending__end" src="${resourcePath.get()}/ending/end.png">
      <img class="npc-ending__logo" src="${resourcePath.get()}/logo.png">
    `;
    this._root.style.backgroundImage = `url(${resourcePath.get()}/ending/end-card.png)`;
  }

  /**
   * デストラクタ相当の処理
   */
  destructor(): void {
    // NOP
  }

  /**
   * ルートHTML要素を取得する
   *
   * @return 取得結果
   */
  getRootHTMLElement(): HTMLElement {
    return this._root;
  }
}