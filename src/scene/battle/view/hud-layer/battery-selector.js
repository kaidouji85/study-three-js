// @flow

import type {Resources} from "../../../../resource";
import {BatterySelector} from "../../../../game-object/battery-selector";
import type {Player} from "gbraver-burst-core/lib/player/player";
import type {GameLoop} from "../../../../action/game-loop/game-loop";
import {Observable, Observer} from "rxjs";
import type {OverlapAction} from "../../../../action/overlap";
import type {BattleSceneAction} from "../../../../action/battle-scene";
import type {GameObjectAction} from "../../../../action/game-object-action";

type Param = {
  resources: Resources,
  listener: Observable<GameObjectAction>,
  notifier: Observer<BattleSceneAction>,
  playerInfo: Player
}

/** バッテリーセレクタを生成する */
export function createBatterySelector(param: Param): BatterySelector {
  return new BatterySelector({
    listener: param.listener,
    maxBattery: param.playerInfo.armdozer.maxBattery,
    resources: param.resources,
    onBatteryChange: (battery: number) => {
      param.notifier.next({
        type: 'changeBattery',
        battery: battery});
    },
    onOkButtonPush: () => {
      param.notifier.next({
        type: 'decideBattery'
      });
    }
  });
}