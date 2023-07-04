const fs = require("fs").promises;
const path = require("path");
const nanoid = require("nanoid");

const contactsPath = path.join("./models", "contacts.json");
const columns = ["name", "email", "phone"];

//Function listing all contacts from contacts.json
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const dataArray = JSON.parse(data.toString());

    return dataArray;
  } catch (err) {
    return err.message;
  }
}

//Function returning contact by id
async function getContactById(contactId) {
  const data = await fs.readFile(contactsPath);
  const dataArray = JSON.parse(data.toString());
  const contact = dataArray.find((element) => element.id === contactId);

  if (contact) {
    return contact;
  } else {
    return 404;
  }
}

//Function removing contact by id
async function removeContact(contactId) {
  const data = await fs.readFile(contactsPath);
  const dataArray = JSON.parse(data.toString());

  const newArray = dataArray.filter((element) => element.id !== contactId);

  if (dataArray.length > newArray.length) {
    fs.writeFile(contactsPath, JSON.stringify(newArray));
    return 200;
  } else {
    return 404;
  }
}

//Function adding new contact
async function addContact(name, email, phone) {
  const data = await fs.readFile(contactsPath);
  const dataArray = JSON.parse(data.toString());

  const newContact = {
    id: nanoid.nanoid(),
    name: name,
    email: email,
    phone: phone,
  };
  dataArray.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(dataArray));
  return newContact;
}

//Function updating existing contact

async function updateContact(contactId, body) {
  const contact = await getContactById(contactId);

  if (contact === 404) {
    return 404;
  }

  const data = await fs.readFile(contactsPath);
  const dataArray = JSON.parse(data.toString());
  const newArray = dataArray.filter((element) => element.id !== contactId);

  contact.name = body.name ? body.name : contact.name;
  contact.email = body.email ? body.email : contact.email;
  contact.phone = body.phone ? body.phone : contact.phone;

  newArray.push(contact);
  fs.writeFile(contactsPath, JSON.stringify(newArray));

  return contact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
