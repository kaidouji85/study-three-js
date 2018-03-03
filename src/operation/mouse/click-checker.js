// @flow
import Rx from "rxjs/Rx";
import * as R from 'ramda';

/** クリック判定に必要なイベントを集めたもの */
type ClickEvent = MouseTouchDown | MouseTouchStart;

/** マウスダウン*/
type MouseTouchDown = {
  type: 'mouseTouchDown',
  isOverlap: boolean
}

/** マウスアップ */
type MouseTouchStart = {
  type: 'mouseTouchUp',
  isOverlap: boolean
}

/** マウスのクリック判定をする*/
export class ClickChecker {
  _clickEventStream: Rx.Subject;

  constructor(param: {onClick: () => void}) {
    this._clickEventStream = new Rx.Subject();

    this._clickEventStream
      .bufferCount(2)
      .filter((eventList: ClickEvent[]) => R.equals(eventList, [
        {type: 'mouseTouchDown', isOverlap: true},
        {type: 'mouseTouchUp', isOverlap: true}
      ]))
      .subscribe(() => param.onClick());
  }

  /**
   * マウスがゲーム画面にタッチダウンした際に呼ばれる関数
   *
   * @param isOverlap クリック判定対象とマウスが重なっているか否かのフラグ、trueで重なっている
   */
  onMouseDown(isOverlap: boolean) {
    this._clickEventStream.next({type: 'mouseTouchDown', isOverlap});
  }

  /**
   * マウスがゲーム画面にタッチアップした際に呼ばれる関数
   *
   * @param isOverlap クリック判定対象とマウスが重なっているか否かのフラグ、trueで重なっている
   */
  onMouseUp(isOverlap: boolean) {
    this._clickEventStream.next({type: 'mouseTouchUp', isOverlap});
  };
}