// @flow

import type {RecoverBatteryModel} from "./recover-battery-model";

export function createInitialValue(): RecoverBatteryModel {
  return {
    value: 3,
    opacity: 0
  };
}