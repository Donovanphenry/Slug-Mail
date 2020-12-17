// RESET THE DATABASE VVVVV
// docker stop $(docker ps -aq)
// docker rm $(docker ps -aq)

const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectEmailById = async (id) => {
  const select = 'SELECT * FROM mail WHERE id = $1';

  const query = {
    text: select,
    values: [id],
  };

  const {rows} = await pool.query(query);

  return rows.length == 1 ? rows[0] : undefined;
};

exports.selectEmailByData = async (data) => {
  let select = `SELECT * FROM mail WHERE mail->>'content' ~* $1 OR `;
  select += `mail->>'subject' ~* $1 OR mail->'from'->>'name' ~* $1 OR `;
  select += `mail->'from'->>'email' ~* $1`;

  const query = {
    text: select,
    values: [data],
  };

  const {rows} = await pool.query(query);

  let emails = [];

  for (const row of rows) {
    const emailStrippedOfCont = row.mail;
    emailStrippedOfCont.id = row.id;
    emailStrippedOfCont['starred'] = row.starred;
    emailStrippedOfCont['unread'] = row.unread;

    emails.push(emailStrippedOfCont);
  }

  return emails;
};

exports.selectEmailByUsername = async (key) => {
  let select = `SELECT * FROM mail WHERE (mail->'from'->>'name' ~* $1 AND`
  select += ` mail->'from'->>'name' != 'CSE183 Student') OR `;
  select += `(mail->'from'->>'email' ~* $1 `
  select += `AND mail->'from'->>'email' != 'CSE183 Student')`;

  const query = {
    text: select,
    values: [key],
  };

  const {rows} = await pool.query(query);

  let emails = [];

  for (const row of rows) {
    const emailStrippedOfCont = row.mail;
    emailStrippedOfCont.id = row.id;
    emailStrippedOfCont['starred'] = row.starred;
    emailStrippedOfCont['unread'] = row.unread;

    emails.push(emailStrippedOfCont);
  }

  return emails;
};

exports.getAllMail = async (mailbox, from, starred) => {
  if (mailbox) {
    const query = 'SELECT DISTINCT mailbox FROM mail';
    const mailCollectionSet = await pool.query(query);

    if (mailCollectionSet.rows.find((mailCollection) =>
      mailCollection.mailbox == mailbox) == undefined) {
      return undefined;
    }
  }
  const values = [];
  let select = 'SELECT * FROM mail';
  if (mailbox && from) {
    select += ` WHERE mailbox = $1 AND (mail->'from'->>'name' `;
    select += `~* $2 OR mail->'from'->>'email' ~* $2)`;
    values.push(mailbox, from);
  } else if (mailbox && from == undefined) {
    select += ' WHERE mailbox = $1';
    values.push(`${mailbox}`);
  } else if (from) {
    select += ` WHERE mail->'from'->>'name' ~* $1`;
    select += ` OR mail->'from'->>'email' ~* $1`;
    values.push(`${from}`);
  }

  if (starred == 'true') {
    select += ` AND starred = true`;
  }

  select += ' ORDER BY mailbox ASC';

  const query = {
    text: select,
    values: values,
  };

  const {rows} = await pool.query(query);

  let emails = [];
  const allMail = [];
  let currentMailbox = rows.length > 0 ? rows[0].mailbox : undefined;

  for (const row of rows) {
    if (currentMailbox != row.mailbox) {
      allMail.push({'mailbox': currentMailbox, 'mail': emails});
      currentMailbox = row.mailbox;
      emails = [];
    }

    // const {content, ...emailStrippedOfCont} = row.mail;
    const emailStrippedOfCont = row.mail;
    emailStrippedOfCont.id = row.id;
    emailStrippedOfCont['starred'] = row.starred;
    emailStrippedOfCont['unread'] = row.unread;

    emails.push(emailStrippedOfCont);
  }

  if (currentMailbox) {
    allMail.push({'mailbox': currentMailbox, 'mail': emails});
  }

  return allMail;
};

exports.selectAllMailboxes = async () => {
  let query = 'SELECT DISTINCT mailbox FROM mail';

  let {rows} = await pool.query(query);
  let mailboxOrder = 1;

  const mailboxes = [];
  for (const mailbox of rows) {
    const currentMailbox = {};
    currentMailbox.name = mailbox.mailbox;

    if (currentMailbox.name == 'Inbox') {
      currentMailbox.sectionType = 'inbox';
      currentMailbox.order = 0;
    } else if (currentMailbox.name == 'Starred') {
      currentMailbox.sectionType = 'ssdt';
      currentMailbox.order = 1;
    } else if (currentMailbox.name == 'Sent' ) {
      currentMailbox.sectionType = 'ssdt';
      currentMailbox.order = 2;
    } else if (currentMailbox.name == 'Trash') {
      currentMailbox.sectionType = 'ssdt';
      currentMailbox.order = 3;
    } else if (currentMailbox.name == 'drafts') {
      currentMailbox.sectionType = 'ssdt';
      currentMailbox.order = 4;
    } else {
      currentMailbox.sectionType = 'userCreated';
      currentMailbox.order = 5;
    }

    let select = 'SELECT mail FROM mail'
    select += ' WHERE mailbox = $1 AND unread = true';

    query = {
      text: select,
      values: [currentMailbox.name],
    };

    rows = await pool.query(query);

    currentMailbox.count = rows.rowCount;

    mailboxes.push(currentMailbox);
  }
  
  const currentMailbox = {name: 'Starred', sectionType: 'ssdt'};

  const select = 'SELECT COUNT(*) FROM mail WHERE starred = true';

  rows = await pool.query(select);

  currentMailbox.order = mailboxOrder;
  currentMailbox.count = JSON.parse(rows.rows[0].count);
  mailboxes.push(currentMailbox);

  return mailboxes;
};

exports.selectAllStarred = async () => {
  let select = 'SELECT * FROM mail WHERE starred = true ORDER BY mailbox ASC';

  const query = {
    text: select,
  };

  const {rows} = await pool.query(query);

  let emails = [];
  const allMail = [];

  for (const row of rows) {
    const emailStrippedOfCont = row.mail;
    emailStrippedOfCont.id = row.id;
    emailStrippedOfCont['starred'] = row.starred;
    emailStrippedOfCont['unread'] = row.unread;

    emails.push(emailStrippedOfCont);
  }

  allMail.push({mailbox: 'Starred', mail: emails});

  return allMail;
};

exports.insertMail = async (emailBody) => {
  let insert = 'INSERT INTO mail (mailbox, mail) ';
  insert += 'VALUES ($1, $2) RETURNING id';

  let received = new Date();
  received = received.toISOString();
  const sent = received;

  const emailPosted = {
    'to': emailBody.to,
    'from': {
      'name': 'CSE183 Student',
      'email': 'cse183student@ucsc.edu',
      'avatar': 'https://icon-library.com/images/default-profile-icon/default-profile-icon-16.jpg',
    },
    'subject': emailBody.subject,
    'received': received,
    'sent': sent,
    'content': emailBody.content,
  };

  const query = {
    text: insert,
    values: ['Sent', emailPosted],
  };

  const {rows} = await pool.query(query);
  emailPosted['id'] = rows[0].id;
  emailPosted['starred'] = false;
  emailPosted['unread'] = true;

  return emailPosted;
};

exports.insertMailbox = async (mailbox) => {
  const select = 'SELECT mailbox FROM mail WHERE mailbox = $1';

  let query = {
    text: select,
    values: [mailbox],
  };

  const queryResult = await pool.query(query);
  console.log(queryResult);

  let insert = 'INSERT INTO mail (mailbox) ';
  insert += 'VALUES ($1)';

  query = {
    text: insert,
    values: [mailbox],
  };

  const {rows} = await pool.query(query);
  console.log('Printing rows');
  console.log(rows);

  return 200;
};

exports.updateMailbox = async (id, mailbox) => {
  const emailRow = await this.selectEmailById(id);

  if (emailRow == undefined) {
    return null;
  }

  if (mailbox == 'Sent' && emailRow.mailbox != 'Sent') {
    return 409;
  }

  const update = 'UPDATE mail SET mailbox = $1 WHERE id = $2';

  const query = {
    text: update,
    values: [mailbox, id],
  };

  await pool.query(query);
};

/**
 * 
 * @param {*} id
 * @return
 */
exports.updateStarred = async (id) => {
  const emailRow = await this.selectEmailById(id);
  const starredProp = !emailRow.starred;

  if (emailRow == undefined) {
    return 404;
  }

  const update = `UPDATE mail SET starred = $1 WHERE id = $2`;

  const query = {
    text: update,
    values: [starredProp, id],
  };

  await pool.query(query);

  const mail = emailRow.mail;
  mail.starred = starredProp;

  return mail;
};

/**
 * 
 * @param {*} id
 * @param {*} newReadVal
 * @return
 */
exports.updateUnread = async (id, newReadVal) => {
  const emailRow = await this.selectEmailById(id);
  const unreadProp = newReadVal == 'true';

  if (emailRow == undefined) {
    return 404;
  }

  const update = `UPDATE mail SET unread = $1 WHERE id = $2`;

  const query = {
    text: update,
    values: [unreadProp, id],
  };

  await pool.query(query);

  const mail = emailRow.mail;
  mail.unread = unreadProp;
  mail.starred = emailRow.starred;

  return mail;
};

console.log(`Connected to database '${process.env.POSTGRES_DB}'`);
