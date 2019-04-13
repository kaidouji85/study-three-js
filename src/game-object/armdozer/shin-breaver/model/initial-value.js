// @flow

import type {ShinBraverModel} from "./shin-braver-model";

export function createInitialValue(): ShinBraverModel {
  return {
    position: {
      x: 150,
      y: 0,
      z: 0
    },
    animation: {
      type: 'STAND',
      frame: 0
    }
  }
}