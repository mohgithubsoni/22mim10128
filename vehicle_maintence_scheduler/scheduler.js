const axios = require("axios");
require("dotenv").config({ path: __dirname + "/../logging_middleware/.env" });
const { Log } = require("../logging_middleware/logger");

const BASE = "http://4.224.186.213/evaluation-service";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
};

async function getDepots() {
  await Log("backend", "info", "service", "fetching depot list");
  const res = await axios.get(`${BASE}/depots`, { headers });
  await Log("backend", "info", "service", `got ${res.data.depots.length} depots`);
  return res.data.depots;
}

async function getVehicleTasks() {
  await Log("backend", "info", "service", "fetching vehicle task list");
  const res = await axios.get(`${BASE}/vehicles`, { headers });
  await Log("backend", "info", "service", `got ${res.data.vehicles.length} vehicle tasks`);
  return res.data.vehicles;
}


function solve(tasks, budget) {
  const dp = new Array(budget + 1).fill(0);
  const keep = Array.from({ length: tasks.length }, () =>
    new Array(budget + 1).fill(false)
  );

  for (let i = 0; i < tasks.length; i++) {
    const { Duration: d, Impact: val } = tasks[i];
    for (let w = budget; w >= d; w--) {
      if (dp[w - d] + val > dp[w]) {
        dp[w] = dp[w - d] + val;
        keep[i][w] = true;
      }
    }
  }


  const picked = [];
  let rem = budget;
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (keep[i][rem]) {
      picked.push(tasks[i].TaskID);
      rem -= tasks[i].Duration;
    }
  }

  return { maxImpact: dp[budget], picked };
}

async function run() {
  await Log("backend", "info", "service", "vehicle maintenance scheduler starting");

  try {
    const [depots, tasks] = await Promise.all([getDepots(), getVehicleTasks()]);

    for (const depot of depots) {
      await Log(
        "backend", "debug", "service",
        `running knapsack for depot ${depot.ID} with budget ${depot.MechanicHours}h`
      );

      const { maxImpact, picked } = solve(tasks, depot.MechanicHours);

      await Log(
        "backend", "info", "service",
        `depot ${depot.ID} => maxImpact: ${maxImpact}, tasks picked: ${picked.length}`
      );

      console.log(`\nDepot ${depot.ID}`);
      console.log(`  Budget       : ${depot.MechanicHours} hours`);
      console.log(`  Max Impact   : ${maxImpact}`);
      console.log(`  Tasks Picked : ${picked.length}`);
      console.log(`  Task IDs     :`);
      picked.forEach((id) => console.log(`    - ${id}`));
    }

    await Log("backend", "info", "service", "scheduler finished for all depots");

  } catch (err) {
    await Log("backend", "error", "service", `scheduler crashed: ${err.message}`);
    console.error("something went wrong:", err.message);
    process.exit(1);
  }
}

run();