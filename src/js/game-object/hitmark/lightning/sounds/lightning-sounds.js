// @flow

import {Howl} from 'howler';
import type {Resources} from "../../../../resource";
import {SOUND_IDS} from "../../../../resource/sound";

/**
 * 電撃 音
 */
export class LightningSounds {
  lightning: typeof Howl;

  /**
   * コンストラクタ
   *
   * @param resources リソース管理オブジェクト
   */
  constructor(resources: Resources) {
    const lightningResource = resources.sounds.find(v => v.id === SOUND_IDS.LIGHTNING_ATTACK);
    this.lightning = lightningResource
      ? lightningResource.sound
      : new Howl();
  }
}