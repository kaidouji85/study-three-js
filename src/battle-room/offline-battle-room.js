// @flow
import type {GameState} from "gbraver-burst-core/lib/game-state/game-state";
import type {Command} from "gbraver-burst-core/lib/command/command";
import type {NPC, NPCRoutine} from "../npc/npc";
import {progress, start} from 'gbraver-burst-core';
import type {Player} from "gbraver-burst-core/lib/player/player";
import type {PlayerCommand} from "gbraver-burst-core/lib/command/player-command";
import type {BattleRoom, InitialState} from "./battle-room";

export class OfflineBattleRoom implements BattleRoom {
  _player: Player;
  _enemy: Player;
  _routine: NPCRoutine;
  _stateHistory: GameState[];

  constructor(player: Player, npc: NPC) {
    this._player = player;
    this._enemy = {
      playerId: `enemy-of-${player.playerId}`,
      armdozer: npc.armdozer
    };
    this._routine = npc.routine;
    this._stateHistory = [];
  }

  /** 戦闘開始 */
  async start(): Promise<InitialState> {
    this._stateHistory = start(this._player, this._enemy);
    return {
      playerId: this._player.playerId,
      players: [this._player, this._enemy],
      stateHistory: this._stateHistory
    };
  }

  /** 戦闘を進める */
  async progress(command: Command): Promise<GameState[]> {
    if (this._stateHistory.length <= 0) {
      return [];
    }

    const lastState = this._stateHistory[this._stateHistory.length - 1];
    const playerCommand: PlayerCommand = {
      playerId: this._player.playerId,
      command: command
    };
    const enemyCommand: PlayerCommand = {
      playerId: this._enemy.playerId,
      command: this._routine(this._enemy.playerId, this._stateHistory)
    };
    const updateState = progress(lastState, [playerCommand, enemyCommand]);
    this._stateHistory = [...this._stateHistory, ...updateState];
    return updateState;
  }
}