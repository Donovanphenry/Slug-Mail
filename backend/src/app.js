const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const email = require('./email');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.safeLoad(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

app.get('/v0/mail', email.getAllMail);
app.get('/v0/mail/:id', email.getByEmailID);
app.get('/v0/mail/search/:key', email.getMailFromSearch);
app.get('/v0/mail/searchByUsername/:key', email.getMailFromUsername);
app.get('/v0/mailboxes', email.getAllMailboxes);
app.post('/v0/mail', email.postMail);
app.post('/v0/mail/newMailbox/:mailbox', email.postMailbox);
app.put('/v0/mail/:id', email.putMailByIdMB);
app.get('/v0/starred', email.getAllStarred);
app.put('/v0/mail/starred/:id', email.toggleStarredById);
app.put('/v0/mail/unread/:id/:unread', email.toggleUnreadById);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
