const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

/**
* An HTTP endpoint that acts as a webhook for Scheduler minutely event
*/
module.exports = async () => {

  let currentDate = new Date();

  if (currentDate.getMinutes() % 20 !== 0) {
    return {
      successful: false,
      message: 'This API will only check the given URLs every 20 minutes'
    };
  }

  let workflow = {};

  // [Workflow Step 1]

  console.log(`Running airtable.query[@0.3.4].select()...`);

  workflow.urlRows = await lib.airtable.query['@0.3.4'].select({
    table: `URLs`,
    where: [
      {}
    ],
    limit: {
      'count': 0,
      'offset': 0
    }
  });

  // [Workflow Step 2]

  console.log(`Running http.request[@0.1.0]()...`);

  for (let i = 0; i < Math.min(workflow.urlRows.rows.length, 3); i++) {

    workflow.response = await lib.http.request['@0.1.0']({
      url: workflow.urlRows.rows[i].fields.URL,
      options: {}
    }).catch(err => {
      console.log(err);
    });

    if (!workflow.response) {
      continue;
    }

    let identifier = workflow.urlRows.rows[i].fields.URL + ':' + (currentDate.getDay() * 144 + currentDate.getHours() * 6 + Math.floor(currentDate.getMinutes() / 20));

    workflow.selectQueryResult = await lib.airtable.query['@0.3.4'].select({
      table: `Logs`,
      where: [{
        Identifier: identifier
      }]
    });

    if (workflow.selectQueryResult.rows.length) {

      console.log(`Running airtable.query[@0.3.4].update()...`);

      workflow.updateQueryResult = await lib.airtable.query['@0.3.4'].update({
        table: `Logs`,
        where: [{
          Identifier: identifier
        }],
        limit: {
          count: 1
        },
        fields: {
          'Duration': workflow.response.timings.phases.total,
          'Status Code': workflow.response.statusCode,
          'URL': [workflow.urlRows.rows[i].id]
        }
      }).catch(err => {
        console.log(err);
      });

    } else {

      console.log(`Running airtable.query[@0.3.4].insert()...`);

      workflow.insertQueryResult = await lib.airtable.query['@0.3.4'].insert({
        table: `Logs`,
        fields: {
          'Identifier': identifier,
          'Duration': workflow.response.timings.phases.total,
          'Status Code': workflow.response.statusCode,
          'URL': [workflow.urlRows.rows[i].id]
        }
      }).catch(err => {
        console.log(err);
      });

    }

  }

  return {
    successful: true
  };

};