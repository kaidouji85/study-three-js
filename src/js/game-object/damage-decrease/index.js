// @flow

import type {Resources} from "../../resource";
import {PlayerDamageDecreaseView} from "./view/player-damage-decrease-view";
import {EnemyDamageDecreaseView} from "./view/enemy-damage-decrease-view";
import {DamageDecrease} from "./damage-decrease";
import type {GameObjectAction} from "../action/game-object-action";
import type {Stream} from "../../stream/core";

/**
 * プレイヤー ダメージ減少 ポップアップ
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @return 生成結果
 */
export function playerDamageDecrease(resources: Resources, listener: Stream<GameObjectAction>): DamageDecrease {
  const view = new PlayerDamageDecreaseView(resources);
  return new DamageDecrease(view, resources, listener);
}

/**
 * 敵 ダメージ減少 ポップアップ
 *
 * @param resources リソース管理オブジェクト
 * @param listener イベントリスナ
 * @return 生成結果
 */
export function enemyDamageDecrease(resources: Resources, listener: Stream<GameObjectAction>): DamageDecrease {
  const view = new EnemyDamageDecreaseView(resources);
  return new DamageDecrease(view, resources, listener);
}