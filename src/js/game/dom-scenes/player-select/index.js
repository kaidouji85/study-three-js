// @flow

import type {Resources} from "../../../resource";
import {ArmdozerSelector} from "./armdozer-selector/armdozer-selector";
import type {ArmDozerId, PilotId} from "gbraver-burst-core";
import {Observable, Subject, Subscription} from "rxjs";
import {PilotSelector} from "./pilot-selector/pilot-selector";
import {domUuid} from "../../../uuid/dom-uuid";
import {ArmdozerBustShotContainer} from "./armdozer-bust-shot/armdozer-bust-shot-container";
import {PilotBustShotContainer} from "./pilot-bust-shot/pilot-bust-shot-container";
import {ArmDozerIdList, PilotIds} from "gbraver-burst-core";
import type {DOMScene} from "../dom-scene";

/**
 * プレイヤーの選択内容
 */
type PlayerDecide = {
  armdozerId: ArmDozerId,
  pilotId: PilotId
};

/**
 * プレイヤーセレクト プレゼンテーション
 */
export class PlayerSelect implements DOMScene {
  _root: HTMLElement;
  _armdozerBustShot: ArmdozerBustShotContainer;
  _pilotBustShot: PilotBustShotContainer;
  _armdozerSelector: ArmdozerSelector;
  _pilotSelector: PilotSelector;
  _armdozerId: ArmDozerId;
  _pilotId: PilotId;
  _playerDecide: Subject<PlayerDecide>;
  _prev: Subject<void>;
  _subscriptions: Subscription[];

  /**
   * コンストラクタ
   *
   * @param resources リソース管理オブジェクト
   */
  constructor(resources: Resources) {
    const armDozerIds = [
      ArmDozerIdList.SHIN_BRAVER,
      ArmDozerIdList.NEO_LANDOZER,
      ArmDozerIdList.LIGHTNING_DOZER,
      ArmDozerIdList.WING_DOZER,
    ];
    const pilotIds = [
      PilotIds.SHINYA,
      PilotIds.GAI,
    ];
    this._armdozerId = ArmDozerIdList.SHIN_BRAVER
    this._pilotId = PilotIds.SHINYA;

    const selectorId = domUuid();
    const workingId = domUuid();

    this._playerDecide = new Subject();
    this._prev = new Subject();

    this._root = document.createElement('div');
    this._root.className = 'player-select';
    this._root.innerHTML = `
      <div class="player-select__working" data-id="${workingId}"></div>
      <div class="player-select__selector" data-id="${selectorId}"></div>
    `;

    const working = this._root.querySelector(`[data-id="${workingId}"]`)
      ?? document.createElement('div');

    this._armdozerBustShot = new ArmdozerBustShotContainer(resources, armDozerIds, this._armdozerId);
    working.appendChild(this._armdozerBustShot.getRootHTMLElement());

    this._pilotBustShot = new PilotBustShotContainer(resources, pilotIds);
    this._pilotBustShot.hidden();
    working.appendChild(this._pilotBustShot.getRootHTMLElement());

    const selector = this._root.querySelector(`[data-id="${selectorId}"]`)
      ?? document.createElement('div');

    this._armdozerSelector = new ArmdozerSelector(resources,armDozerIds, this._armdozerId);
    selector.appendChild(this._armdozerSelector.getRootHTMLElement());

    this._pilotSelector = new PilotSelector(resources, pilotIds, this._pilotId);
    this._pilotSelector.hidden();
    selector.appendChild(this._pilotSelector.getRootHTMLElement());

    this._subscriptions = [
      this._armdozerSelector.changeNotifier().subscribe(v => {
        this._onArmdozerChange(v);
      }),
      this._armdozerSelector.decideNotifier().subscribe(v => {
        this._onArmdozerDecided(v);
      }),
      this._armdozerSelector.prevNotifier().subscribe(v => {
        this._onArmdozerSelectorPrev();
      }),
      this._pilotSelector.changeNotifier().subscribe(v => {
        this._onPilotChange(v);
      }),
      this._pilotSelector.decideNotifier().subscribe(v => {
        this._onPilotDecided(v);
      }),
      this._pilotSelector.prevNotifier().subscribe(() => {
        this._onPilotSelectorPrev();
      })
    ];
  }

  /**
   * デストラクタ相当の処理
   */
  destructor(): void {
    this._armdozerSelector.destructor();
    this._pilotSelector.destructor();
    this._subscriptions.forEach(v => {
      v.unsubscribe();
    })
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
   * リソース読み込みが完了するまで待つ
   *
   * @return 待機結果
   */
  async waitUntilLoaded(): Promise<void> {
    await Promise.all([
      this._armdozerBustShot.waitUntilLoaded(),
      this._armdozerSelector.waitUntilLoaded(),
      this._pilotBustShot.waitUnlillLoaded(),
      this._pilotSelector.waitUntilLoaded()
    ]);
  }

  /**
   * 選択完了通知
   *
   * @return 通知ストリーム
   */
  decideNotifier(): Observable<PlayerDecide> {
    return this._playerDecide;
  }

  /**
   * 戻る通知
   * @return 通知ストリーム
   */
  prevNotifier(): Observable<void> {
    return this._prev;
  }
  
  /**
   * アームドーザを変更した時の処理
   *
   * @param armdozerId 変更したアームドーザID
   */
  _onArmdozerChange(armdozerId: ArmDozerId): void {
    this._armdozerBustShot.switch(armdozerId);
  }

  /**
   * アームドーザを決定した時の処理
   *
   * @param armdozerId 決定したアームドーザID
   */
  _onArmdozerDecided(armdozerId: ArmDozerId): void {
    this._armdozerId = armdozerId;
    this._pilotBustShot.switch(this._pilotId);
    this._pilotSelector.show();

    this._armdozerSelector.hidden();
  }

  /**
   * アームドーザセレクタの戻るボタンを押した時の処理
   */
  _onArmdozerSelectorPrev(): void {
    this._prev.next();
  }

  /**
   * パイロットが変更された時の処理
   *
   * @param pilotId 変更したパイロットID
   */
  _onPilotChange(pilotId: PilotId): void {
    this._pilotId = pilotId;
    this._pilotBustShot.switch(pilotId);
  }

  /**
   * パイロットを決定した時の処理
   *
   * @param pilotId 決定したパイロットID
   */
  _onPilotDecided(pilotId: PilotId): void {
    this._pilotId = pilotId;
    this._playerDecide.next({
      armdozerId: this._armdozerId,
      pilotId: this._pilotId
    });
  }

  /**
   * パイロットセレクタの戻るボタンを押した時の処理
   */
  _onPilotSelectorPrev(): void {
    this._pilotSelector.hidden();
    this._pilotBustShot.hidden();

    this._armdozerSelector.show();
  }
}