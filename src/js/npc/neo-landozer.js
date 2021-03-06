// @flow

import type {NPC} from "./npc";
import type {Armdozer, Command, GameState, Pilot, PlayerId, PlayerState} from "gbraver-burst-core";
import {ArmDozerIdList, ArmDozers, PilotIds, Pilots} from "gbraver-burst-core";

/** 0バッテリー */
const ZERO_BATTERY = {
  type: 'BATTERY_COMMAND',
  battery: 0
};

/**
 * ネオランドーザNPC
 */
export class NeoLandozerNPC implements NPC {
  /** アームドーザ */
  armdozer: Armdozer;

  /** パイロット */
  pilot: Pilot;

  constructor() {
    this.armdozer = ArmDozers.find(v => v.id === ArmDozerIdList.NEO_LANDOZER) || ArmDozers[0];
    this.pilot = Pilots.find(v => v.id === PilotIds.SHINYA) || Pilots[0];
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
    const player = lastState.players.find(v => v.playerId !== enemyId);
    if (!enableCommand || !enemy || !player) {
      return ZERO_BATTERY;
    }

    if (enableCommand.selectable === false) {
      return enableCommand.nextTurnCommand;
    }

    const isAttacker = lastState.activePlayerId === enemyId;
    return isAttacker
      ? this._attackRoutine(enemy, player, enableCommand.command)
      : this._defenseRoutine(enemy, enableCommand.command);
  }

  /**
   * 攻撃ルーチン
   *
   * @param enemy NPCのステータス
   * @param player プレイヤーのステータス
   * @param commands 選択可能なコマンド
   * @return コマンド
   */
  _attackRoutine(enemy: PlayerState, player: PlayerState, commands: Command[]): Command {
    const burst = commands.find(v => v.type === 'BURST_COMMAND');
    const maxBattery = commands.find(v => v.type === 'BATTERY_COMMAND' && v.battery === enemy.armdozer.battery);
    const maxBatteryMinusOne = commands.find(v => v.type === 'BATTERY_COMMAND' && v.battery === enemy.armdozer.battery - 1);
    const battery1 = commands.find(v => v.type === 'BATTERY_COMMAND' && v.battery === 1);
    const battery0 = commands.find(v => v.type === 'BATTERY_COMMAND' && v.battery === 0);

    const canFullBatteryAttack = player.armdozer.battery <= 4;
    const plusCorrectPowers = enemy.armdozer.effects.filter(v => v.type === 'CorrectPower' && (0 < v.power));
    const hasPlusCorrectPower = 0 < plusCorrectPowers.length;

    if (burst && canFullBatteryAttack) {
      return burst;
    }

    if (burst && battery0 && !canFullBatteryAttack) {
      return battery0;
    }

    if (hasPlusCorrectPower && maxBattery && canFullBatteryAttack) {
      return maxBattery;
    }

    if (maxBatteryMinusOne) {
      return maxBatteryMinusOne;
    }

    if (battery1) {
      return battery1;
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
    const maxBattery = commands.find(v => v.type === 'BATTERY_COMMAND' && v.battery === enemy.armdozer.battery);
    const battery1 = commands.find(v => v.type === 'BATTERY_COMMAND' && v.battery === 1);

    if (burst && maxBattery) {
      return maxBattery;
    }

    if (battery1) {
      return battery1;
    }

    return ZERO_BATTERY;
  }
}
