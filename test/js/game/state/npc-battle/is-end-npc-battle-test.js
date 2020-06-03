// @flow

import test from 'ava';
import type {EndBattle} from "../../../../../src/js/action/game/battle";
import {EMPTY_PLAYER} from "../../../../data/player";
import type {Player, GameOver, EvenMatch} from "gbraver-burst-core";
import {EMPTY_END_BATTLE} from "../../../../data/end-battle";
import type {NPCBattle} from "../../../../../src/js/game/state/npc-battle/npc-battle";
import {EMPTY_NPC_BATTLE} from "../../../../data/npc-battle";
import {isNPCBattleEnd, isWin} from "../../../../../src/js/game/state/npc-battle/level-up";
import {MAX_LEVEL} from "../../../../../src/js/game/state/npc-battle/npc-battle";

const player: Player = {
  ...EMPTY_PLAYER,
  playerId: 'test-player'
};

const win: GameOver = {
  type: 'GameOver',
  winner: player.playerId
};

const lose: GameOver = {
  type: 'GameOver',
  winner: 'not-test-player'
};

test('NPC戦闘終了条件が正しく判定できる', t => {
  const state: NPCBattle = {
    ...EMPTY_NPC_BATTLE,
    player: player,
    level: MAX_LEVEL
  };
  const action: EndBattle = {
    ...EMPTY_END_BATTLE,
    gameEnd: {
      ...EMPTY_END_BATTLE.gameEnd,
      result: win
    }
  };

  const result = isNPCBattleEnd(state, action);
  t.true(result);
});

test('勝利しても最大レベルでない場合はfalseを返す', t => {
  const state: NPCBattle = {
    ...EMPTY_NPC_BATTLE,
    player: player,
    level: MAX_LEVEL - 1
  };
  const action: EndBattle = {
    ...EMPTY_END_BATTLE,
    gameEnd: {
      ...EMPTY_END_BATTLE.gameEnd,
      result: win
    }
  };

  const result = isNPCBattleEnd(state, action);
  t.false(result);
});

test('最大レベルでも勝利以外の場合はfalseを返す', t => {
  const state: NPCBattle = {
    ...EMPTY_NPC_BATTLE,
    player: player,
    level: MAX_LEVEL
  };
  const action: EndBattle = {
    ...EMPTY_END_BATTLE,
    gameEnd: {
      ...EMPTY_END_BATTLE.gameEnd,
      result: lose
    }
  };

  const result = isNPCBattleEnd(state, action);
  t.false(result);
});