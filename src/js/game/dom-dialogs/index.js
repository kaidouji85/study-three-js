// @flow

import {HowToPlay} from "./how-to-play";
import {Observable} from "rxjs";
import type {EndHowToPlay} from "../../action/game/how-to-play";
import type {ResourceRoot} from "../../resource/root/resource-root";

/** イベント通知ストリーム */
type Notifier = {
  endHowToPlay: Observable<EndHowToPlay>,
};

/** HTML ダイアログをあつめたもの */
export class DOMDialogs {
  _howToPlay: HowToPlay;

  constructor(resourcePath: ResourceRoot) {
    this._howToPlay = new HowToPlay(resourcePath);
  }

  /** 遊び方ダイアログを表示する */
  showHowToPlay(): void {
    this._howToPlay.show();
  }

  /** 前ダイアログを非表示にする */
  hidden(): void {
    this._howToPlay.hidden();
  }

  /**
   * イベント通知ストリームを取得する
   *
   * @return イベント通知ストリーム
   */
  notifier(): Notifier {
    return {
      endHowToPlay: this._howToPlay.notifier().endHowToPlay,
    }
  }

  /**
   * 本クラスに含まれる全てのルートHTML要素を取得する
   *
   * @return 取得結果
   */
  getRootHTMLElements(): HTMLElement[] {
    return [
      this._howToPlay.getRootHTMLElement()
    ];
  }
}