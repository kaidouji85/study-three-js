// @flow

import type {PlayerState} from "gbraver-burst-core/lib/game-state/player-state";
import type {TDPlayer} from "../../../view/td/player";
import type {HUDPlayer} from "../../../view/hud/player";
import type {TDGameObjects} from "../../../view/td/game-objects";
import {Battle3DCamera} from "../../../../../game-object/camera/battle-3d";
import type {HUDGameObjects} from "../../../view/hud/game-objects";
import {BattleHUDCamera} from "../../../../../game-object/camera/battle-hud";
import {BattleSceneView} from "../../../view";
import type {BattleSceneState} from "../../../state/battle-scene-state";
import type {GameState} from "gbraver-burst-core/lib/game-state/game-state";
import type {ArmdozerState} from "gbraver-burst-core/lib/game-state/armdozer/armdozer-state";
import type {BurstEffect} from "gbraver-burst-core/lib/effect/burst/burst-effect";
import {overWriteTDSprite} from "../../../view/td/player";
import type {Burst} from "gbraver-burst-core/lib/armdozer/burst";

/**
 * バーストアニメーションのパラメータ
 *
 * @type SPRITE スプライト
 * @type BURST バースト
 */
export type BurstAnimationParam<SPRITE, BURST> = {
  burstPlayerState: PlayerState,
  burstPlayerTD: TDPlayer<SPRITE>,
  burstPlayerHUD: HUDPlayer,
  tdObjects: TDGameObjects,
  tdCamera: Battle3DCamera,
  hudObjects: HUDGameObjects,
  hudCamera: BattleHUDCamera,
  burst: BURST
};

/**
 * バーストアニメーションパラメータを生成する
 *
 * @param view ビュー
 * @param sceneState シーンステート
 * @param gameState ゲームステート
 * @return バーストアニメーションパラメータ
 */
export function toBurstAnimationParam(view: BattleSceneView, sceneState: BattleSceneState, gameState: GameState): ?BurstAnimationParam<ArmdozerState, Burst> {
  if (gameState.effect.name !== 'BurstEffect') {
    return null;
  }

  const effect: BurstEffect = gameState.effect;
  const burstPlayerState = gameState.players.find(v => v.playerId === effect.burstPlayer);
  const burstPlayerTD = view.td.players.find(v => v.playerId === effect.burstPlayer);
  const burstPlayerHUD = view.hud.players.find(v => v.playerId === effect.burstPlayer);
  if (!burstPlayerState || !burstPlayerTD || !burstPlayerHUD) {
    return null;
  }

  return {
    burstPlayerState: burstPlayerState,
    burstPlayerTD:burstPlayerTD,
    burstPlayerHUD: burstPlayerHUD,
    tdObjects: view.td.gameObjects,
    tdCamera: view.td.camera,
    hudObjects: view.hud.gameObjects,
    hudCamera: view.hud.camera,
    burst: effect.burst
  };
}

/**
 * スプライトを引数の内容で上書きする
 *
 * @param param バーストアニメーションパラメータ
 * @param sprite 上書きするスプライト
 * @return 更新結果
 */
export function overWriteSprite<OLD_SPRITE, NEW_SPRITE, BURST>(
  param: BurstAnimationParam<OLD_SPRITE, BURST>,
  sprite: NEW_SPRITE): BurstAnimationParam<NEW_SPRITE, BURST>
{
  const ignoreAttackerTD: $Diff<BurstAnimationParam<OLD_SPRITE, BURST>, { burstPlayerTD: TDPlayer<OLD_SPRITE> }> = param;
  const burstPlayerTD = overWriteTDSprite(param.burstPlayerTD, sprite);
  return {
    ...ignoreAttackerTD,
    burstPlayerTD: burstPlayerTD
  };
}

/**
 * バーストを引数の内容で上書きする
 *
 * @param param バーストアニメーションパラメータ
 * @param burst 上書きするバースト
 * @return 更新結果
 */
export function overWriteBurst<SPRITE, OLD_BURST, NEW_BURST>(
  param: BurstAnimationParam<SPRITE, OLD_BURST>,
  burst: NEW_BURST
): BurstAnimationParam<SPRITE, NEW_BURST>
{
  const ignoreBurst: $Diff<BurstAnimationParam<SPRITE, OLD_BURST>, { burst: OLD_BURST }> = param;
  return {
    ...ignoreBurst,
    burst: burst
  };
}