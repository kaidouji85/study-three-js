// @flow

import type {Listener} from "../base/listener";
import type {DOMEvent} from "../../action/dom-event";

/** HTMLイベントのリスナー */
export type DOMEventListener = Listener<DOMEvent>;