/* icons.js — Icônes de rubriques (traits, charte), avatars des personnages, signes de S.O.Ssi */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const NAVY = '#1D3768', CYAN = '#08A9E0', CORAL = '#E2556A', PALE = '#EFFAFF';
  const svg = (vb, body, extra) =>
    '<svg viewBox="' + vb + '" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"' + (extra || '') + '>' + body + '</svg>';
  const line = (body) => svg('0 0 64 64',
    '<g fill="none" stroke="' + NAVY + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' + body + '</g>');

  /* ---------- Rubriques ---------- */
  SOS.icons = {
    atlas: line(
      '<path d="M12 12a8 8 0 1 1 16 0c0 6-8 15-8 15s-8-9-8-15z"/>' +
      '<circle cx="20" cy="12" r="2.5" stroke="' + CYAN + '"/>'),
    ville: line(
      '<path d="M8 54h48"/><path d="M12 54V30h14v24"/><path d="M26 54V14h18v40"/><path d="M44 54V34h8v20"/>' +
      '<path d="M31 22h8M31 30h8M31 38h8" stroke="' + CYAN + '"/>'),
    jeux: line(
      '<rect x="8" y="20" width="48" height="26" rx="13"/><path d="M21 28v10M16 33h10"/>' +
      '<circle cx="42" cy="30" r="2.2" fill="' + CYAN + '" stroke="' + CYAN + '"/><circle cx="48" cy="36" r="2.2" fill="' + CYAN + '" stroke="' + CYAN + '"/>'),
    quiz: line(
      '<path d="M10 14h44a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2H30l-12 10V44h-8a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2z"/>' +
      '<path d="M26 26a6 6 0 1 1 8 5.6c-1.4.6-2 1.6-2 3" stroke="' + CYAN + '"/><circle cx="32" cy="38.5" r="1.2" fill="' + CYAN + '" stroke="' + CYAN + '"/>')
  };

  /* ---------- Avatars (illustrations génériques de rôles, pas de vraies personnes) ---------- */
  let uid = 0;
  const A = (inner) => {
    const id = 'av' + (++uid);   // identifiant unique : plusieurs avatars peuvent coexister dans la page
    return svg('0 0 120 120',
      '<circle cx="60" cy="60" r="60" fill="' + PALE + '"/><g clip-path="url(#' + id + ')">' + inner + '</g>' +
      '<defs><clipPath id="' + id + '"><circle cx="60" cy="60" r="60"/></clipPath></defs>');
  };
  const face = (skin) =>
    '<rect x="52" y="70" width="16" height="20" rx="6" fill="' + skin + '"/>' +
    '<ellipse cx="60" cy="52" rx="21" ry="24" fill="' + skin + '"/>' +
    '<circle cx="51.5" cy="54" r="2.1" fill="' + NAVY + '"/><circle cx="68.5" cy="54" r="2.1" fill="' + NAVY + '"/>' +
    '<path d="M52 64q8 7 16 0" fill="none" stroke="' + NAVY + '" stroke-width="2.2" stroke-linecap="round"/>';

  SOS.avatars = {
    /* La maman : chignon, cardigan corail */
    mere: A(
      '<circle cx="60" cy="22" r="11" fill="#4A2F27"/>' +
      '<path d="M16 124c0-28 20-40 44-40s44 12 44 40z" fill="' + CORAL + '"/>' +
      '<path d="M44 88l16 20 16-20" fill="#fff"/>' +
      face('#D9A47C') +
      '<path d="M38 52c-2-22 10-30 22-30s24 8 22 30c-4-10-10-16-22-16s-18 6-22 16z" fill="#4A2F27"/>'),
    /* Le directeur : cheveux courts, veste marine, cravate cyan */
    directeur: A(
      '<path d="M14 124c0-28 20-40 46-40s46 12 46 40z" fill="' + NAVY + '"/>' +
      '<path d="M46 86l14 18 14-18-6-4H52z" fill="#fff"/>' +
      '<path d="M57 98h6l3 22H54z" fill="' + CYAN + '"/>' +
      face('#C98F66') +
      '<path d="M39 50c-1-18 9-26 21-26s22 8 21 26c-3-8-6-12-12-13-7 3-18 3-24 0-3 3-5 8-6 13z" fill="#2B2220"/>'),
    /* La psychologue : cheveux ondulés, lunettes, blouse cyan */
    psy: A(
      '<path d="M38 56c-6 22 0 40 8 44h28c8-4 14-22 8-44z" fill="#2B2220"/>' +
      '<path d="M14 124c0-28 20-40 46-40s46 12 46 40z" fill="' + CYAN + '"/>' +
      '<path d="M46 86q14 14 28 0l-4-3H50z" fill="#fff"/>' +
      face('#E0B08A') +
      '<path d="M38 54c-2-22 10-31 22-31s24 9 22 31c-3-11-10-17-22-17s-19 6-22 17z" fill="#2B2220"/>' +
      '<g fill="none" stroke="' + NAVY + '" stroke-width="2"><circle cx="51.5" cy="54" r="6.5"/><circle cx="68.5" cy="54" r="6.5"/><path d="M58 54h4"/></g>')
  };

  /* ---------- Signes qui accompagnent les poses de S.O.Ssi (la tortue elle-même n'est jamais redessinée) ---------- */
  const fx = (body) => svg('0 0 32 32', '<g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6">' + body + '</g>');
  SOS.fx = {
    accueil: fx('<path d="M8 12a8 8 0 0 1 8-6M5 18a13 13 0 0 1 13-12" stroke="' + CYAN + '"/><path d="M24 8l2-3M27 14l3-1" stroke="' + CORAL + '"/>'),
    presentation: fx('<path d="M16 4l2.6 7.4L26 14l-7.4 2.6L16 24l-2.6-7.4L6 14l7.4-2.6z" stroke="' + CYAN + '" fill="#fff"/>'),
    guide: fx('<path d="M5 16h20M18 8l8 8-8 8" stroke="' + CYAN + '"/>'),
    explication: fx('<path d="M11 21c-3-2-4-5-4-8a9 9 0 0 1 18 0c0 3-1 6-4 8v3h-10z" stroke="' + NAVY + '" fill="#fff"/><path d="M13 28h6" stroke="' + CYAN + '"/>'),
    annonce: fx('<path d="M5 13v6h4l9 5V8l-9 5z" stroke="' + NAVY + '" fill="#fff"/><path d="M22 12a5 5 0 0 1 0 8M25 9a9 9 0 0 1 0 14" stroke="' + CYAN + '"/>'),
    famille: fx('<path d="M16 26S5 19.5 5 12.2A5.7 5.7 0 0 1 16 10a5.7 5.7 0 0 1 11 2.2C27 19.5 16 26 16 26z" stroke="' + CORAL + '" fill="#fff"/>'),
    reflexion: fx('<path d="M12 12a4.2 4.2 0 1 1 6.4 3.6c-1.6 1-2.4 1.8-2.4 3.4" stroke="' + NAVY + '"/><path d="M16 25h.01" stroke="' + CYAN + '" stroke-width="3.4"/>'),
    encouragement: fx('<path d="M16 4l3.5 7.6 8 .9-6 5.5 1.7 8L16 22l-7.2 3.9 1.7-8-6-5.5 8-.9z" stroke="' + CORAL + '" fill="#fff"/>')
  };
})();
