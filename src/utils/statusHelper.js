export const getStatusCount = (issues = []) => {
  const counts = {
    totalIssues: issues.length,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  };

  issues.forEach(issue => {
    const { progress } = issue;

    if (progress?.verified?.completed && !progress?.inProgress?.completed && !progress?.resolved?.completed) {
      counts.pending += 1;
    } else if (progress?.inProgress?.completed && !progress?.resolved?.completed) {
      counts.inProgress += 1;
    } else if (progress?.resolved?.completed) {
      counts.resolved += 1;
    }
  });

  return counts;
};
