/**
* An HTTP endpoint that acts as a webhook for Scheduler minutely event
* @returns {object} result The result of your workflow steps
*/
module.exports = async () => {

  let currentDate = new Date();

  if (currentDate.getMinutes() % 10 !== 0) {
    return;
  }

  let workflow = {};

  // [Workflow Step 1]

  console.log(`Running airtable.query[@0.3.4].select()...`);

  workflow.urlRows = await lib.airtable.query['@0.3.4'].select({
    table: `URIs`,
    where: [
      {}
    ],
    limit: {
      'count': 0,
      'offset': 0
    }
  });

  // [Workflow Step 2]

  console.log(`Running airtable.query[@0.3.4].count()...`);

  workflow.countQueryResult = await lib.airtable.query['@0.3.4'].count({
    table: `Log`,
    where: [
      {}
    ],
    limit: {
      'count': 0,
      'offset': 0
    }
  });

  // [Workflow Step 3]

  console.log(`Running http.request[@0.1.0]()...`);

  for (let i = 0; i < workflow.urlRows.rows.length; i++) {

    workflow.response = await lib.http.request['@0.1.0']({
      url: workflow.urlRows.rows[i].fields.URL,
      options: {}
    }).catch(err => {
      console.log(err);
    });

    if (!workflow.response) {
      continue;
    }

    // [Workflow Step 4]

    let id = (i * 1008) + ((currentDate.getDay() * 144 + currentDate.getHours() * 6 + Math.floor(currentDate.getMinutes() / 10)) % 1008);

    workflow.selectQueryResult = await lib.airtable.query['@0.3.4'].select({
      table: `Log`,
      where: [{
        id: id
      }]
    });

    if (workflow.selectQueryResult.rows.length) {

      console.log(`Running airtable.query[@0.3.4].update()...`);

      workflow.updateQueryResult = await lib.airtable.query['@0.3.4'].update({
        table: `Log`,
        where: [{
          id: id
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
        table: `Log`,
        fields: {
          'id': id,
          'Duration': workflow.response.timings.phases.total,
          'Status Code': workflow.response.statusCode,
          'URL': [workflow.urlRows.rows[i].id]
        }
      }).catch(err => {
        console.log(err);
      });

    }

  };

};