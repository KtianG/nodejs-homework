const express = require("express");
const managingContacts = require("../../services/managingContacts");

const router = express.Router();

//Retrieving array of contacts
router.get("/", async (req, res, next) => {
  const contactsArray = await managingContacts.listContacts();

  if (Array.isArray(contactsArray)) {
    res.status(200).json({
      status: "success",
      code: 200,
      data: contactsArray,
    });
  } else {
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Internal Server Error",
    });
  }
});

//Retrieving single contact by ID
router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await managingContacts.getContactById(contactId);

  if (contact === 404) {
    res.status(404).json({
      status: "fail",
      code: 404,
      message: "Not found",
    });
  } else {
    res.status(200).json({
      status: "success",
      code: 200,
      data: contact,
    });
  }
});

//Adding new contact to database
router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (name && email && phone) {
    const contact = await managingContacts.addContact(name, email, phone);

    res.status(201).json({
      status: "success",
      code: 201,
      data: contact,
    });
  } else {
    let missingFields = "";
    if (!name) {
      missingFields += "name ";
    }
    if (!email) {
      missingFields += "email ";
    }
    if (!phone) {
      missingFields += "phone ";
    }

    res.status(400).json({
      status: "fail",
      code: 400,
      message: `missing reguired fields - ${missingFields}`,
    });
  }
});

//Deleting contact from database
router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const status = await managingContacts.removeContact(contactId);

  if (status === 200) {
    res.status(200).json({
      status: "success",
      code: 200,
      message: "contact deleted",
    });
  } else {
    res.status(404).json({
      status: "fail",
      code: 404,
      message: "Not found",
    });
  }
});

//Updating contact info in database
router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;

  if (Object.keys(body).length === 0) {
    res.status(400).json({
      status: "fail",
      code: 404,
      message: "Missing fields",
    });
    return;
  }

  const updatedContact = await managingContacts.updateContact(contactId, body);

  if (updatedContact === 404) {
    res.status(404).json({
      status: "fail",
      code: 404,
      message: "Not found",
    });
    return;
  }

  res.status(201).json({
    status: "success",
    code: 201,
    data: updatedContact,
  });
});

module.exports = router;
