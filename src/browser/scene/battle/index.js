// @flow
import type {Resources} from '../../resource';
import {BattleSceneView} from "./view";
import type {BattleSceneState} from "./state/battle-scene-state";
import type {GameLoop} from "../../action/game-loop/game-loop";
import {Observable, Observer, Subject, Subscription} from "rxjs";
import type {DOMEvent} from "../../action/dom-event";
import type {BattleSceneAction} from "../../action/battle-scene";
import type {DecideBattery} from "../../action/battle-scene/decide-battery";
import {createInitialState} from "./state/initial-state";
import type {BattleRoom, InitialState} from "../../battle-room/battle-room";
import {stateHistoryAnimation} from "./animation/state-history";
import {invisibleUI} from "./animation/invisible-ui";
import type {Render} from "../../action/game-loop/render";
import type {DoBurst} from "../../action/battle-scene/do-burst";
import type {Command} from "gbraver-burst-core/lib/command/command";
import {take} from "rxjs/operators";
import type {GameState} from "gbraver-burst-core/lib/game-state/game-state";
import {delay} from "../../animation/delay";
import type {EndBattle} from "../../action/game/end-battle";

/** コンストラクタのパラメータ */
type Param = {
  resources: Resources,
  rendererDOM: HTMLElement,
  battleRoom: BattleRoom,
  initialState: InitialState,
  listener: {
    domEvent: Observable<DOMEvent>,
    gameLoop: Observable<GameLoop>,
  },
  notifier: {
    render: Observer<Render>,
    endBattle: Observer<EndBattle>,
  }
};

/**
 * 戦闘画面アプリケーション
 */
export class BattleScene {
  _view: BattleSceneView;
  _state: BattleSceneState;
  _battleAction: Subject<BattleSceneAction>;
  _battleRoom: BattleRoom;
  _endBattle: Observer<EndBattle>;
  _subscription: Subscription;

  constructor(param: Param) {
    this._state = createInitialState(param.initialState.playerId);
    this._battleAction = new Subject();
    this._battleRoom = param.battleRoom;
    this._endBattle = param.notifier.endBattle;
    this._view = new BattleSceneView({
      resources: param.resources,
      rendererDOM: param.rendererDOM,
      playerId: param.initialState.playerId,
      players: param.initialState.players,
      listener: {
        gameLoop: param.listener.gameLoop,
        domEvent: param.listener.domEvent,
      },
      notifier: {
        render: param.notifier.render,
        battleAction: this._battleAction,
      }
    });

    this._subscription = this._battleAction.subscribe(action => {
      if (action.type === 'decideBattery') {
        this._decideBattery(action);
      } else if (action.type === 'doBurst') {
        this._doBurst(action);
      }
    });

    param.listener.gameLoop.pipe(
      take(1)
    ).subscribe(action => {
      this._start(param.initialState.stateHistory);
    });
  }

  /** デストラクタ */
  destructor(): void {
    this._view.destructor();
    this._subscription.unsubscribe();
  }

  /**
   * 戦闘シーン開始時の処理
   * 
   * @param stateHistory 初期ステータス
   */
  async _start(stateHistory: GameState[]): Promise<void> {
    const animation = delay(500)
      .chain(stateHistoryAnimation(this._view, this._state, stateHistory));
    await animation.play();
  }

  /** バッテリー決定 */
  async _decideBattery(action: DecideBattery): Promise<void> {
    if (!this._state.canOperation) {
      return;
    }

    this._state.canOperation = false;
    await invisibleUI(this._view).play();
    const lastState = await this._progressGame({
      type: 'BATTERY_COMMAND',
      battery: action.battery
    });
    if (lastState && lastState.effect.name === 'GameEnd') {
      this._endBattle.next({type: 'endBattle'});
    }

    this._state.canOperation = true;
  }

  /** バースト */
  async _doBurst(action: DoBurst): Promise<void> {
    if (!this._state.canOperation) {
      return;
    }

    this._state.canOperation = false;
    await invisibleUI(this._view).play();
    const lastState = await this._progressGame({type: 'BURST_COMMAND'});
    if (lastState && lastState.effect.name === 'GameEnd') {
      this._endBattle.next({type: 'endBattle'});
    }

    this._state.canOperation = true;
  }

  /**
   * ゲームを進める
   *
   * @param command プレイヤーが入力したコマンド
   * @return ゲームの最新状態、何も更新されなかった場合はnullを返す
   */
  async _progressGame(command: Command): Promise<?GameState> {
    let lastCommand: Command = command;
    let lastState: ?GameState = null;
    for (let i=0; i<100; i++) {
      const updateState = await this._battleRoom.progress(lastCommand);
      await stateHistoryAnimation(this._view, this._state, updateState).play();

      if (updateState.length <= 0) {
        return null;
      }

      lastState = updateState[updateState.length - 1];
      if (lastState.effect.name !== 'InputCommand') {
        return lastState;
      }

      const playerCommand = lastState.effect.players.find(v => v.playerId === this._state.playerId);
      if (!playerCommand) {
        return lastState;
      }

      if (playerCommand.selectable === true) {
        return lastState;
      }

      lastCommand = playerCommand.nextTurnCommand;
    }

    return lastState
  }
}