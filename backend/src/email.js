const db = require('./db');

// Source: https://www.uuidtools.com/what-is-uuid
const emailIDProperFormat =
'[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';

exports.getAllMail = async (req, res) => {
  if (req.query.mailbox) {
    let emails = undefined;

    if (req.query.from) {
      if (req.query.starred) {
        emails = await db.getAllMail(req.query.mailbox, req.query.from, req.query.starred);
      } else {
        emails = await db.getAllMail(req.query.mailbox, req.query.from, undefined);
      }
    } else {
      emails = await db.getAllMail(req.query.mailbox, undefined, req.query.starred);
    }

    if (emails) {
      res.status(200).json(emails);
    } else {
      res.status(404).send();
    }
  } else {
    let emails = undefined;

    if (req.query.from) {
      emails = await db.getAllMail(undefined, req.query.from);
    } else {
      emails = await db.getAllMail();
    }

    res.status(200).json(emails);
  }
};

exports.getAllStarred = async (req, res) => {
  const emails = await db.selectAllStarred();

  res.status(200).json(emails);
}

exports.getByEmailID = async (req, res) => {
  if (req.params.id.match(emailIDProperFormat)) {
    const emailRow = await db.selectEmailById(req.params.id);
    let email = undefined;

    if (emailRow) {
      email = emailRow.mail;
      email.starred = emailRow.starred;
      email.unread = emailRow.unread;
    }

    if (email) {
      res.status(200).json(email);
    } else {
      res.status(404).send();
    }
  } else {
    res.status(400).send();
  }
};

exports.getAllMailboxes = async (req, res) => {
  const mailboxes = await db.selectAllMailboxes();
  
  if (mailboxes) {
    res.status(200).json(mailboxes);
  } else {
    res.status(404).send();
  }
};

exports.getMailFromSearch = async (req, res) => {
  const emailRow = await db.selectEmailByData(req.params.key);
  
  if (emailRow) {
    res.status(200).json(emailRow);
  } else {
    res.status(404).send();
  }
};

exports.getMailFromUsername = async (req, res) => {
  const emailRow = await db.selectEmailByUsername(req.params.key);
  
  if (emailRow) {
    res.status(200).json(emailRow);
  } else {
    res.status(404).send();
  }
};

exports.postMail = async (req, res) => {
  const email = await db.insertMail(req.body);

  res.status(201).json(email);
};

exports.postMailbox = async (req, res) => {
  const status = await db.insertMailbox(req.params.mailbox);

  res.status(status).send();
};

exports.putMailByIdMB = async (req, res) => {
  const email = await db.updateMailbox(req.params.id, req.query.mailbox);

  if (email !== null) {
    if (email == 409) {
      res.status(409).send();
    } else {
      res.status(204).send();
    }
  } else {
    res.status(404).send();
  }
};

exports.toggleStarredById = async (req, res) => {
  const email = await db.updateStarred(req.params.id);

  if (email == 404) {
    res.status(404).send();
  } else {
    res.status(200).json(email);
  }
};

exports.toggleUnreadById = async (req, res) => {
  const email = await db.updateUnread(req.params.id, req.params.unread);

  if (email == 404) {
    res.status(404).send();
  } else {
    res.status(200).json(email);
  }
};
