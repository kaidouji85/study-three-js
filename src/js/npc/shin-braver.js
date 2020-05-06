// @flow

import type {NPC} from "./npc";
import type {Armdozer, Command, GameState, PlayerId, PlayerState} from "gbraver-burst-core";
import {ArmDozerIdList, ArmDozers} from "gbraver-burst-core";

/** 0バッテリー */
const ZERO_BATTERY = {
  type: 'BATTERY_COMMAND',
  battery: 0
};

/**
 * シンブレイバー NPC
 */
export class ShinBraverNPC implements NPC {
  /**
   * アームドーザ
   */
  armdozer: Armdozer;

  constructor() {
    this.armdozer = ArmDozers.find(v => v.id === ArmDozerIdList.SHIN_BRAVER) || ArmDozers[0];
  }

  /**
   * ルーチン
   *
   * @param enemyId NPCのプレイヤーID
   * @param gameStateHistory ステートヒストリー
   * @return コマンド
   */
  routine(enemyId: PlayerId, gameStateHistory: GameState[]): Command {
    if (gameStateHistory.length <= 0) {
      return ZERO_BATTERY;
    }

    const lastState = gameStateHistory[gameStateHistory.length - 1];
    if (lastState.effect.name !== 'InputCommand') {
      return ZERO_BATTERY;
    }

    const enableCommand = lastState.effect.players.find(v => v.playerId === enemyId);
    const enemy = lastState.players.find(v => v.playerId === enemyId);
    if (!enableCommand || !enemy) {
      return ZERO_BATTERY;
    }

    if (enableCommand.selectable === false) {
      return enableCommand.nextTurnCommand;
    }

    const isAttacker = lastState.activePlayerId === enemyId;
    return isAttacker
      ? this._attackRoutine(enemy, enableCommand.command)
      : this._defenseRoutine(enemy, enableCommand.command);
  }

  /**
   * 攻撃ルーチン
   *
   * @param enemy NPCのステータス
   * @param commands 選択可能なコマンド
   * @return コマンド
   */
  _attackRoutine(enemy: PlayerState, commands: Command[]): Command {
    const burst = commands.find(v => v.type === 'BURST_COMMAND');
    const battery5 = commands.find(v => v.type === 'BATTERY_COMMAND' && v.battery === 5);
    const batteryMaxMinus1 = commands.find(v => v.type === 'BATTERY_COMMAND' && v.battery === (enemy.armdozer.battery - 1));

    if (burst && battery5) {
      return battery5;
    }

    if (batteryMaxMinus1) {
      return batteryMaxMinus1;
    }

    return ZERO_BATTERY;
  }

  /**
   * 防御ルーチン
   *
   * @param enemy NPCのステータス
   * @param commands 選択可能なコマンド
   * @return コマンド
   */
  _defenseRoutine(enemy: PlayerState, commands: Command[]): Command {
    const burst = commands.find(v => v.type === 'BURST_COMMAND');
    const battery3 = commands.find(v => v.type === 'BATTERY_COMMAND' && v.battery === 3);
    const battery1 = commands.find(v => v.type === 'BATTERY_COMMAND' && v.battery === 1);

    if (burst && (enemy.armdozer.battery === 0)) {
      return burst;
    }

    if (battery3 && (enemy.armdozer.battery === 5)) {
      return battery3;
    }

    if (battery1) {
      return battery1;
    }

    return ZERO_BATTERY;
  }
}