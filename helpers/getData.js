const lib = require('lib')({ token: process.env.STDLIB_SECRET_TOKEN });

// Returns a number to indicate the uptime over the past week
const calculateUptime = data => {
  let u = data.reduce(
    (acc, current) => {
      if (current.Status === 200) {
        acc[0] = acc[0] + 1;
        return acc;
      }
      acc[1] = acc[1] + 1;
      return acc;
    },
    [0, 0]
  );
  return Math.floor(u[0] / (u[0] + u[1]) * 100);
};

module.exports = async url => {
  const data = await lib.airtable.query['@0.3.3']
    .select({
      table: 'Logs',
      where: [
        {
          Current: 'Yes',
          URL__contains: url
        }
      ]
    })
    .then(r => {
      return r.rows.map(n => {
        return {
          url: n.fields.URL[0],
          Duration: n.fields.Duration,
          Hour: n.fields.Hour,
          TID: n.fields.TID,
          Status: n.fields['Status Code']
        };
      });
    });

  // Here I am trying to populate an object that can keep track of all logs associated with a particular URL
  // This sometimes works, and sometimes seems to timeout when running.
  const logs = data.reduce((logs, row) => {
    let day = row.TID.toString();
    let hour = row.Hour;
    let responseCode = row.Status;

    if (!logs[day]) {
      logs[day] = {};
    }

    if (!logs[day][hour]) {
      logs[day][hour] = [];
    }

    if (responseCode !== 200) {
      logs[day][hour]["responseCode"] = responseCode;
    }

    logs[day][hour].push(row.Duration);

    if (logs[day][hour].length === 3) {
      let total = logs[day][hour].reduce((acc, cur) => {
        acc = acc + cur;
        return acc;
      }, 0);
      logs[day][hour]["latency"] =  [Math.trunc(total / logs[day][hour].length, 2)];
    }

    return logs;
  }, {});

  return [logs, calculateUptime(data)];
};
