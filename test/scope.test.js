import test from 'tape';
import littlefoot from '../src/';
import { setup, teardown } from './helper';

test('littlefoot setup with scope=body', (t) => {
  setup('default.html');

  const footnoteReferences = document.body.querySelectorAll('.footnote');
  const footnotes          = document.body.querySelectorAll('.reversefootnote');

  littlefoot({ scope: 'body' });

  const footnoteButtons    = document.body.querySelectorAll('[data-littlefoot-footnote]');
  const processedFootnotes = document.body.querySelectorAll('.footnote-processed');

  t.equal(footnoteButtons.length, footnoteReferences.length, 'creates buttons for all footnotes when scope is body');
  t.equal(processedFootnotes.length, footnotes.length, 'processes all footnotes when scope is body');

  teardown();
  t.end();
});

test('littlefoot setup with scope=#invalid', (t) => {
  setup('default.html');

  littlefoot({ scope: '#invalid' });

  const footnoteButtons    = document.body.querySelectorAll('[data-littlefoot-footnote]');
  const processedFootnotes = document.body.querySelectorAll('.footnote-processed');

  t.equal(footnoteButtons.length, 0, 'creates no footnote buttons when scope is #invalid');
  t.equal(processedFootnotes.length, 0, 'processes no footnotes when scope is #invalid');

  teardown();
  t.end();
});
