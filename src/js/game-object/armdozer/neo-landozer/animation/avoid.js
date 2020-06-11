// @flow

import {NeoLandozerModel} from "../model/neo-landozer-model";
import {Animate} from "../../../../animation/animate";
import {process} from "../../../../animation/process";
import {tween} from "../../../../animation/tween";
import {all} from "../../../../animation/all";
import {NeoLandozerSounds} from "../sounds/neo-landozer-sounds";
import {delay} from "../../../../animation/delay";

/** 避ける */
export function avoid(model: NeoLandozerModel, sounds: NeoLandozerSounds): Animate {
  return process(() => {
    model.animation.type = 'BACK_STEP';
    model.animation.frame = 0;
    sounds.motor.play();
  })
    .chain(all(
      tween(model.position, t => t.to({x: '+40'}, 150)),
      tween(model.animation, t => t.to({frame: 1}, 150)),
    ));
}