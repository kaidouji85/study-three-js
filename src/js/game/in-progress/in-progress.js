// @flow

import type {None} from "./none/none";
import type {NPCBattle} from "./npc-battle/npc-battle";
import type {CasualMatch} from "./casual-match/casual-match";

/**
 * 現在進行中のフローの状態を保持する
 */
export type InProgress = None | NPCBattle | CasualMatch;
