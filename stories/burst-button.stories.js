// @flow
import {HUDGameObjectStub} from "./stub/hud-game-object-stub";
import {BurstButton} from "../src/js/game-object/burst-button/burst-button";

export default {
  title: 'burst-button',
};

export const canBurst = (): HTMLElement => {
  const stub = new HUDGameObjectStub((resources, listener) => {
    const burstButton = new BurstButton({
      resources: resources,
      listener: listener,
      onPush: () => {
        burstButton.decide().play();
      },
    });
    burstButton.open(true).play();
    return [burstButton.getObject3D()];
  });
  stub.start();
  return stub.domElement();
}

export const disabled = (): HTMLElement => {
  const stub = new HUDGameObjectStub((resources, listener) => {
    const burstButton = new BurstButton({
      resources: resources,
      listener: listener,
      onPush: () => {
        // NOP
      },
    });
    burstButton.open(false).play();
    return [burstButton.getObject3D()];
  });
  stub.start();
  return stub.domElement();
}