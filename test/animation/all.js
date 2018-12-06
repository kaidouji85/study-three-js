// @flow

import test from 'ava';
import {all} from '../../src/animation/all';
import {tween} from "../../src/animation/tween";

test('再生時間が一番長いものがnextに設定されている', t => {
  const p1 = tween({}, t => t
    .to({}, 500)
  );
  const p2 = tween({}, t => t
    .to({}, 300)
  );
  const p3 = tween({}, t => t
      .to({}, 1000)
    );
  const v = all(p1, p2, p3);

  t.is(v._end, p3._end);
  t.is(v._time, 1000);
});