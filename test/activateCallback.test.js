import test from 'tape';
import sinon from 'sinon';
import { setup, sleep, teardown } from './helper';
import littlefoot from '../src/';

test('littlefoot setup with activateCallback', (t) => {
  setup('default.html');

  const callback = sinon.spy();

  const lf = littlefoot({ activateCallback: callback });

  const activateDelay = lf.getSetting('activateDelay');

  lf.activate('button[data-footnote-id="1"]');

  sleep(activateDelay)
    .then(() => {
      t.ok(callback.called, 'activateCallback called');

      teardown();
      t.end();
    });
});
