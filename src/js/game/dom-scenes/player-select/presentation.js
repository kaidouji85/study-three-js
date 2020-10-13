// @flow

import type {Resources} from "../../../resource";
import {ArmdozerSelector} from "./armdozer-selector";
import type {ArmDozerId, PilotId} from "gbraver-burst-core";
import {Observable} from "rxjs";
import {PilotSelector} from "./pilot-selector";
import {domUuid} from "../../../uuid/dom-uuid";

/**
 * プレイヤーセレクト プレゼンテーション
 */
export class PlayerSelectPresentation {
  _root: HTMLElement;
  _armdozerSelector: ArmdozerSelector;
  _pilotSelector: PilotSelector;

  /**
   * コンストラクタ
   *
   * @param resources リソース管理オブジェクト
   * @param armDozerIds 選択できるアームドーザのID
   * @param pilotIds 選択できるパイロットのID
   */
  constructor(resources: Resources, armDozerIds: ArmDozerId[], pilotIds: PilotId[]) {
    const selectorContentsId = domUuid();

    this._root = document.createElement('div');
    this._root.className = 'player-select';
    this._root.innerHTML = `
      <img class="player-select__bust-shot" src="${resources.rootPath.get()}/armdozer/shin-braver/bust-shot.png" />
      <div class="player-select__selector">
        <button class="player-select__selector__prev">戻る</button>
        <div class="player-select__selector__contents" data-id="${selectorContentsId}"></div>
        <button class="player-select__selector__ok">OK</button>
      </div>
    `;

    const selectorContents = this._root.querySelector(`[data-id="${selectorContentsId}"]`)
      ?? document.createElement('div');
    this._armdozerSelector = new ArmdozerSelector(resources,armDozerIds);
    selectorContents.appendChild(this._armdozerSelector.getRootHTMLElement());

    this._pilotSelector = new PilotSelector(resources, pilotIds);
    selectorContents.appendChild(this._pilotSelector.getRootHTMLElement());
  }

  /**
   * デストラクタ相当の処理
   */
  destructor(): void {
    this._armdozerSelector.destructor();
    this._pilotSelector.destructor();
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
   * アームドーザセレクタを表示する
   */
  showArmdozerSelector(): void {
    this._armdozerSelector.show();
    this._pilotSelector.hidden();
  }

  /**
   * パイロットセレクタを表示する
   */
  showPilotSelector(): void {
    this._pilotSelector.show();
    this._armdozerSelector.hidden();
  }

  /**
   * リソース読み込みが完了するまで待つ
   *
   * @return 待機結果
   */
  async waitUntilLoaded(): Promise<void> {
    await Promise.all([
      this._armdozerSelector.waitUntilLoaded(),
      this._pilotSelector.waitUntilLoaded()
    ]);
  }

  /**
   * アームドーザ選択の通知
   *
   * @return イベント通知ストリーム
   */
  armdozerSelectedNotifier(): Observable<ArmDozerId> {
    return this._armdozerSelector.armdozerSelectedNotifier();
  }

  /**
   * パイロット選択の通知
   *
   * @return イベント通知ストリーム
   */
  pilotSelectedNotifier(): Observable<PilotId> {
    return this._pilotSelector.pilotSelectedNotifier();
  }
}