const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const path = require('path')
const { promisify } = require('util')

const renderFile = promisify(require('ejs').renderFile)

const templatePath = path.join(__dirname, '/../static/components/index.ejs');

let app;

function getURLS() {
  return lib.airtable.query['@0.3.4'].select({
    table: "URLs"
  }).then(r => {
    return r.rows.map(n => {
      let desc = n.fields.Description || "A Website";
      let url = n.fields.URL || "Whoops! You forgot the URL!"
      return {
        url: url,
        displayName: desc,
        id: n.id
      };
    });
  });
};

/**
 * @returns {object.http}
 */
module.exports = async (context) => {
  const URLS = await getURLS();
  let templateVars = {
    displayNames: URLS.map(url => url.displayName),
    services: URLS.map(url => url.url),
    ids: URLS.map(url => url.id),
    servicePath: context.service.identifier,
    title: 'Status',
    mainPageURL: process.env.MAIN_PAGE_URL,
    logoURL: process.env.LOGO_URL
  }

  app = app || await renderFile(templatePath, templateVars);

  return {
    headers: {
      'Content-Type': 'text/html'
    },
    body: app,
    statusCode: 200
  };
}
