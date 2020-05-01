// @flow

import {Observable} from "rxjs";
import {Title} from "./title";
import type {PushGameStart, PushHowToPlay} from "../../action/game/title";
import type {ResourcePath} from "../../resource/path/resource-path";

/** コンストラクタのパラメータ */
type Param = {
  resourcePath: ResourcePath
};

/** イベント通知 */
type Notifier = {
  pushGameStart: Observable<PushGameStart>,
  pushHowToPlay: Observable<PushHowToPlay>,
};

/**
 * HTMLオンリーで生成されたシーンを集めたもの
 * 本クラス配下のいずれか1シーンのみが表示される想定
 */
export class DOMScenes {
  _title: Title;
  _notifier: Notifier;

  constructor(param: Param) {
    this._title = new Title(param.resourcePath);
    const titleDOM: HTMLElement = document.querySelector("#title-scene") || document.createElement('div');
    titleDOM.appendChild(this._title.getHTMLElement());

    const titleNotifier = this._title.notifier();
    this._notifier = {
      pushGameStart: titleNotifier.pushGameStart,
      pushHowToPlay: titleNotifier.pushHowToPlay,
    };
  }

  /** デストラクタ相当の処理 */
  destructor() {
    // NOP
  }

  /**
   * イベント通知ストリームを取得する
   *
   * @return イベント通知ストリーム
   */
  notifier(): Notifier {
    return this._notifier;
  }

  /** タイトルを表示する */
  showTitle(): void {
    this._title.show();
  }

  /**
   * 本クラス配下のシーンを全て非表示にする
   * 本メソッドは、3Dシーンを表示する前に呼ばれる想定である
   */
  hidden(): void {
    this._title.hidden();
  }

  
}