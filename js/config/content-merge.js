(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const fix = SOS.fixContent;
  const aya = SOS.content;

  SOS.content = Object.assign({}, fix, aya);
  SOS.content.hero = Object.assign({}, fix.hero, aya.hero);
  SOS.content.mascot = fix.mascot;
  SOS.content.nav = fix.nav.filter((item) => item.id !== 'atlas').concat([
    { id: 'aider', label: 'Comment je peux aider', icon: 'aider', desc: 'Découvre comment le PAP fait grandir la lumière, étoile après étoile.' }
  ]);
  SOS.content.sides = Object.assign({}, fix.sides, aya.sides, {
    aider: { x: 'left', y: 'bottom' }
  });
  SOS.content.ui = Object.assign({}, fix.ui, aya.ui);
  SOS.content.lines = fix.lines;
  SOS.content.lines.views.aider = { first: '', again: '', pose: 'presentation' };
  SOS.content.lines.menu.items.push({
    id: 'aider',
    pose: 'encouragement',
    text: 'Comment je peux aider ? Découvre comment agir concrètement et faire grandir la solidarité.'
  });
  SOS.content.ui['title.aider'] = 'SOS — Comment je peux aider';
})();
