// @flow

import type {Resources} from "../../../../resource";
import type {PilotId} from "gbraver-burst-core";
import {PilotIcon} from "./pilot-icon";
import {Observable, Subject, Subscription} from "rxjs";
import {waitTime} from "../../../../wait/wait-time";
import {domUuid} from "../../../../uuid/dom-uuid";

/**
 * ルート要素のclass名
 */
export const ROOT_CLASS_NAME = 'player-select__pilot-selector';

/**
 * パイロットセレクタ
 */
export class PilotSelector {
  _root: HTMLElement;
  _canOperate: boolean;
  _pilotIcons: PilotIcon[];
  _pilotSelected: Subject<PilotId>;
  _subscriptions: Subscription[];

  /**
   * コンストラクタ
   *
   * @param resources リソース管理オブジェクト
   * @param pilotIds 選択可能なパイロットIDリスト
   */
  constructor(resources: Resources, pilotIds: PilotId[]) {
    const iconsId = domUuid();

    this._canOperate = true;
    this._root = document.createElement('div');
    this._root.className = ROOT_CLASS_NAME;
    this._root.innerHTML = `
      <div class="${ROOT_CLASS_NAME}__status"></div>
      <div class="${ROOT_CLASS_NAME}__icons" data-id="${iconsId}"></div>
      <div class="${ROOT_CLASS_NAME}__controllers">
      <button class="${ROOT_CLASS_NAME}__controllers__prev-button"">戻る</button>
      <button class="${ROOT_CLASS_NAME}__controllers__ok-button">これで出撃</button>
      </div>
    `;

    const icons = this._root.querySelector(`[data-id="${iconsId}"]`)
      ?? document.createElement('div');
    this._pilotIcons = pilotIds.map(v => new PilotIcon(resources, v));
    this._pilotIcons.forEach(v => {
      icons.appendChild(v.getRootHTMLElement());
    });
    
    this._subscriptions = this._pilotIcons.map(icon =>
      icon.selectedNotifier().subscribe(() =>
        this._onPilotSelect(icon)
      ));

    this._pilotSelected = new Subject();
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
   * 本コンポネントを表示する
   */
  show(): void {
    this._root.className = ROOT_CLASS_NAME;
  }

  /**
   * 本コンポネントを非表示にする
   */
  hidden(): void {
    this._root.className = `${ROOT_CLASS_NAME}--hidden`;
  }

  /**
   * リソース読み込みが完了するまで待つ
   *
   * @return 待機結果
   */
  async waitUntilLoaded(): Promise<void> {
    await Promise.all(
      this._pilotIcons.map(icon => icon.waitUntilLoaded())
    );
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
   * パイロット選択通知
   *
   * @return 通知ストリーム
   */
  pilotSelectedNotifier(): Observable<PilotId> {
    return this._pilotSelected;
  }

  /**
   * パイロットが選択された際の処理
   *
   * @param icon 選択されたパイロットアイコン
   * @return 処理結果
   */
  async _onPilotSelect(icon: PilotIcon): Promise<void> {
    if (!this._canOperate) {
      return;
    }
    this._canOperate = false;

    await icon.selected();
    await waitTime(1000);
    this._pilotSelected.next(icon.pilotId);

    this._canOperate = true;
  }
}