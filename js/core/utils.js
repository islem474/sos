/* utils.js — Fonctions utilitaires partagées */
(function () {
  'use strict';
  const SOS = (window.SOS = window.SOS || {});
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  SOS.utils = {
    $: (sel, ctx) => (ctx || document).querySelector(sel),
    $$: (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel)),
    reducedMotion: () => mq.matches,
    clamp: (v, min, max) => Math.min(Math.max(v, min), max),
    splitSpeech: (text, maxLength) => {
      const limit = maxLength || 58;
      const sentences = text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [text];
      return sentences.reduce((chunks, sentence) => {
        let remaining = sentence.trim();
        while (remaining.length > limit) {
          const punctuation = Math.max(
            remaining.lastIndexOf(',', limit),
            remaining.lastIndexOf(';', limit),
            remaining.lastIndexOf(':', limit)
          );
          const cut = punctuation > Math.floor(limit / 2) ? punctuation + 1 : remaining.lastIndexOf(' ', limit);
          if (cut < 1) break;
          let next = remaining.slice(cut).trim();
          let part = remaining.slice(0, cut).trim();
          if (/^[.!?…]/.test(next)) {
            const mark = next.charAt(0);
            part += (/[!?…]/.test(mark) ? ' ' : '') + mark;
            next = next.slice(1).trim();
          }
          chunks.push(part);
          remaining = next;
        }
        if (remaining) chunks.push(remaining);
        return chunks;
      }, []);
    },
    playSpeech: (text, handlers) => {
      const callbacks = handlers || {};
      let progress = 0;
      let timer = null;
      let utterance = null;
      let stopped = false;
      let completed = false;
      const publish = (next) => {
        next = SOS.utils.clamp(next, 0, text.length);
        if (next <= progress) return;
        progress = next;
        if (callbacks.onProgress) callbacks.onProgress(progress);
      };
      const finish = () => {
        if (stopped || completed) return;
        completed = true;
        clearInterval(timer);
        timer = null;
        publish(text.length);
        if (callbacks.onEnd) callbacks.onEnd();
      };
      const voiceAvailable = window.speechSynthesis &&
        typeof window.SpeechSynthesisUtterance === 'function';
      if (voiceAvailable && text.length) {
        const speech = new window.SpeechSynthesisUtterance(text);
        utterance = speech;
        speech.lang = 'fr-FR';
        speech.rate = 0.95;
        if (callbacks.onSpeakingChange) callbacks.onSpeakingChange(true);
        speech.onboundary = (event) => {
          if (stopped || utterance !== speech || !Number.isFinite(event.charIndex)) return;
          const start = SOS.utils.clamp(event.charIndex, 0, text.length);
          const word = text.slice(start).match(/^\S+/);
          publish(word ? start + word[0].length : start);
        };
        speech.onend = () => {
          if (stopped || utterance !== speech) return;
          utterance = null;
          if (callbacks.onSpeakingChange) callbacks.onSpeakingChange(false);
          finish();
        };
        speech.onerror = () => {
          if (stopped || utterance !== speech) return;
          utterance = null;
          if (callbacks.onSpeakingChange) callbacks.onSpeakingChange(false);
          if (progress >= text.length) finish();
        };
      }
      timer = setInterval(() => {
        if (progress < text.length) publish(progress + 1);
        else if (!utterance) finish();
      }, 65);
      if (utterance) window.speechSynthesis.speak(utterance);
      return {
        stop: () => {
          stopped = true;
          clearInterval(timer);
          timer = null;
          const speech = utterance;
          utterance = null;
          if (speech && window.speechSynthesis) window.speechSynthesis.cancel();
        }
      };
    },
    shuffle: (arr) => {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    /** Lit « org.contacts.phone » dans SOS.content */
    resolve: (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), SOS.content)
  };
})();
