import { MEASUREMENT_CONFIG } from './measurement-config.js';
import { mountMeasurementFeedback } from './shared/measurement-feedback-client.mjs';

// Keep the final shared client verbatim. Production intake is explicitly off;
// an in-process fixture may opt in without changing the packaged configuration.
export function mountProductFeedback(container, { enabled = MEASUREMENT_CONFIG.enabled, ...options } = {}) {
  if (typeof enabled !== 'boolean') throw new TypeError('Intake enabled must be boolean');
  const ui = mountMeasurementFeedback(container, {
    ...options, product: 'maildns', consentWindow: enabled,
    ...(!enabled ? { fetchImpl: async () => { throw new Error('unavailable'); } } : {}),
  });
  if (!enabled) {
    const choice = ui.client.choice;
    ui.client.choice = () => choice() === 'blocked' ? 'blocked' : 'no';
    const track = ui.client.track.bind(ui.client);
    ui.client.track = async event => {
      if (!['page_view', 'play_start', 'play_complete', 'feedback_open', 'tool_start', 'tool_complete'].includes(event)) return track('invalid');
      return { ok: true, skipped: true };
    };
    ui.refreshChoice();
  }
  return ui;
}
