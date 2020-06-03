// @flow

import {domStub} from "./stub/dom-stub";
import {DOMFader} from "../src/js/components/dom-fader/dom-fader";
import {waitTime} from "../src/js/wait/wait-time";

export default {
  title: 'dom-fader'
};

export const Scene = domStub(resources => {
  const fader = new DOMFader();
  (async () => {
    await waitTime(5000);
    await fader.fadeIn();
    await waitTime((5000));
    await fader.fadeOut();
  })();
  return fader.getRootHTMLElement();
});