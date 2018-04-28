// @flow

import type {Resources} from "../../../../resource";
import type {BattleSceneState} from "../../state";
import {BatterySlider} from "../../../../game-object/slider/battery-slider";
import type {BattleSceneNotifier} from "../../../../observer/battle-scene/battle-scene-notifier";

/** バッテリースライダーを生成する */
export function createBatterySlider(resources: Resources, state: BattleSceneState, notifier: BattleSceneNotifier): BatterySlider {
  return new BatterySlider({
    resources,
    onBatteryChange: (battery: number) => {
      // TODO オブザーバに通知する
      console.log(`change battery ${battery}`);
    }
  });
}