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
    const [allow, deny] = container.querySelectorAll('button');
    const [choiceStatus] = container.querySelectorAll('p[role="status"]');
    allow.disabled = true;
    const refresh = ui.refreshChoice;
    ui.refreshChoice = () => {
      refresh();
      choiceStatus.textContent = 'Usage counts are unavailable on this page.';
    };
    deny.addEventListener('click', ui.refreshChoice);
    ui.refreshChoice();
  }
  return ui;
}
