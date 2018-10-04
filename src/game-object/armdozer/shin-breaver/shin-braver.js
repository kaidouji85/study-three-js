// @flow

import {Group, Tween} from '@tweenjs/tween.js';
import {ArmDozerSprite} from '../common/armdozer-sprite';
import * as THREE from "three";
import type {ShinBraverView} from "./view/shin-braver-view";
import {stand} from "./animation/stand";
import {Observable} from "rxjs";
import type {SpriteGameLoop} from "../../../action/sprite-game-loop/sprite-game-loop";
import type {GameObjectAction} from "../../../action/game-object-action";
import type {ShinBraverModel} from "./model/shin-braver-model";
import {createInitialValue} from "./model/initial-value";

/** シンブレイバーのゲームオブジェクト */
export class ShinBraver implements ArmDozerSprite {
  _model: ShinBraverModel;
  _view: ShinBraverView;
  _tweenGroup: Group;

  constructor(params: {view: ShinBraverView, listener: Observable<GameObjectAction>}) {
    this._model = createInitialValue();
    this._view = params.view;
    this._tweenGroup = new Group();

    params.listener.subscribe(action => {
      switch (action.type) {
        case 'SpriteGameLoop':
          this._gameLoop(action);
          return;
        default:
          return;
      }
    });

    // TODO シーンから呼ぶようにする
    this.stand();
  }

  /** ゲームループ */
  _gameLoop(action: SpriteGameLoop): void {
    this._tweenGroup.update(action.time);
    this._view.engage(this._model, action.camera);
  }

  /** シーンに追加するオブジェクトを返す */
  getObject3D(): THREE.Object3D {
    return this._view.getObject3D();
  }

  /** 立ち状態にする */
  stand(): void {
    stand(this._model, this._tweenGroup).start();
  }
}