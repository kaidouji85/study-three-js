// @flow

import type {DOMEvent} from "../../../../action/dom-event/index";
import {resize} from "./resize";
import {BattleSceneView} from "../../view";
import type {BattleSceneState} from "../../state/battle-scene-state";

/**
 * HTMLイベントハンドラ
 *
 * @param action htmlイベント
 * @param scene 戦闘シーン
 */
export function domEventHandler(action: DOMEvent, view: BattleSceneView, state: BattleSceneState): void {
  switch(action.type) {
    case 'resize':
      return resize(view, state);
    default:
      return;
  }
}