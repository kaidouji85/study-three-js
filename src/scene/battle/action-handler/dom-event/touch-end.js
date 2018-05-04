// @flow

import {BattleSceneView} from "../../view/index";
import type {TouchEnd} from "../../../../action/dom-event/touch-end";
import type {BattleSceneState} from "../../state";
import type {TouchRaycastContainer} from "../../../../screen-touch/touch/touch-raycaster";
import {createTouchEventRaycaster} from "../../../../screen-touch/touch/touch-raycaster";

/** ゲーム画面内をタッチエンドした際のイベント */
export function touchEnd(view: BattleSceneView, state: BattleSceneState, action: TouchEnd) {
  const hudRaycaster: TouchRaycastContainer = createTouchEventRaycaster(action.event, view.renderer, view.hudLayer.camera);
}