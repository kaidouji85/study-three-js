// @flow

import {Observable} from "rxjs";

/**
 * 購読停止オブジェクト
 */
export interface Unsubscriber {
  /** ストリームの購読を停止する */
  unsubscribe(): void;
}

/**
 * オペレータ
 * @template T 変換前のストリームデータ型
 * @template U 変換後のストリームデータ型
 */
export type Operator<T, U> = (v: Stream<T>) => Stream<U>;

/**
 * ストリーム
 * @template T ストリームが持つデータの型情報
 */
export interface Stream<T> {
  /**
   * ストリームを購読する
   *
   * @param listener イベントリスナ
   * @return 購読停止オブジェクト
   */
  subscribe(listener: (v: T) => void): Unsubscriber;

  /**
   * オペレータを適用する
   *
   * @param operator オペレータ
   * @return 適用結果
   */
  chain<U>(operator: Operator<T, U>): Stream<U>;

  /**
   * 本ストリームが内部的に持つrxjsのObservableを取得する
   * 本メソッドはストリーム加工ヘルパー関数の中でのみ呼ばれることを想定している
   *
   * @return rxjs Observable
   */
  getRxjsObservable(): typeof Observable;
}

/**
 * ストリームの源泉
 */
export interface StreamSource<T> extends Stream<T> {
  /**
   * ストリームに新しい値を流す
   *
   * @param v ストリームに流す値
   */
  next(v: T): void;
}