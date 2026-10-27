import { explain } from './core.js';

// Only the action name reaches analytics. Never pass task names or DNS answers.
export async function runDnsInspection(checker, tasks, client) {
  void client.track('tool_start');
  const results = await checker.run(tasks);
  // Cancellation/supersession returns null. Partial/unusable resolver evidence
  // still renders honestly, but does not count as a successful completion.
  if (results && tasks.length > 0 && tasks.every(([kind]) => results[kind] &&
    !['Unavailable', 'Tool limitation'].includes(explain(kind, results[kind]).state))) {
    void client.track('tool_complete');
  }
  return results;
}
