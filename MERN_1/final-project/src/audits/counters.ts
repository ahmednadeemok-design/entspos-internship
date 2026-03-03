export function createAuditCounters() {
  let runs = 0;
  let flagged = 0;

  return {
    incRuns() {
      runs += 1;
    },
    incFlagged(n = 1) {
      flagged += n;
    },
    get() {
      return { runs, flagged };
    }
  };
}