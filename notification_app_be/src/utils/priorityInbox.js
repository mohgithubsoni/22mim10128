const { Log } = require("../../../logging_middleware/logger");


const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function getTopNByPriority(notifications, n = 10) {
  await Log(
    "backend", "info", "utils",
    `Computing top ${n} priority notifications from ${notifications.length} notifications`
  );

  const sorted = [...notifications].sort((a, b) => {
    const weightDiff = (TYPE_WEIGHT[b.Type] || 0) - (TYPE_WEIGHT[a.Type] || 0);
    if (weightDiff !== 0) return weightDiff;
    
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });

  const top = sorted.slice(0, n);

  await Log(
    "backend", "info", "utils",
    `Top ${n} priority notifications computed successfully`
  );

  return top;
}

module.exports = { getTopNByPriority };