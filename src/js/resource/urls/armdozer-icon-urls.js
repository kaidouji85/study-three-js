// @flow

// TODO 別フォルダに移動させる
import type {ResourcePath} from "../path/resource-path";
import type {ArmDozerId} from "gbraver-burst-core";
import {ArmDozerIdList} from "gbraver-burst-core";

/**
 * アームドーザIDに対応するアイコン画像のURLを返す
 *
 * @param resourcePath リソースパス
 * @param armDozerId アームドーザID
 * @return 画像URL
 */
export function getArmdozerIconURL(resourcePath: ResourcePath, armDozerId: ArmDozerId): string {
  switch (armDozerId) {
    case ArmDozerIdList.SHIN_BRAVER:
      return shinBraverIconURL(resourcePath);
    case ArmDozerIdList.NEO_LANDOZER:
      return neoLandozerIconURL(resourcePath);
    case ArmDozerIdList.LIGHTNING_DOZER:
      return lightningDozerIconURL(resourcePath);
    case ArmDozerIdList.WING_DOZER:
      return wingDozerIconURL(resourcePath);
    default:
      return shinBraverIconURL(resourcePath);
  }
}

/**
 * シンブレイバー アイコン URL
 *
 * @param resourcePath リソースパス
 * @return URL
 */
export function shinBraverIconURL(resourcePath: ResourcePath): string {
  return `${resourcePath.get()}/armdozer/shin-braver/player-select.png`;
}

/**
 * ネオランドーザ アイコン URL
 *
 * @param resourcePath リソースパス
 * @return URL
 */
export function neoLandozerIconURL(resourcePath: ResourcePath): string {
  return `${resourcePath.get()}/armdozer/neo-landozer/player-select.png`;
}

/**
 * ライトニングドーザ アイコン URL
 *
 * @param resourcePath リソースパス
 * @return URL
 */
export function lightningDozerIconURL(resourcePath: ResourcePath): string {
  return `${resourcePath.get()}/armdozer/lightning-dozer/player-select.png`;
}

/**
 * ウィングドーザ アイコン URL
 * @param resourcePath リソースパス
 * @return URL
 */
export function wingDozerIconURL(resourcePath: ResourcePath): string {
  return `${resourcePath.get()}/armdozer/wing-dozer/player-select.png`;
}