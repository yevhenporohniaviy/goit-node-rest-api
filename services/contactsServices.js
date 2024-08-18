import Contacts from "../db/models/Contacts.js";

const listContacts = async () => await Contacts.findAll();

const getContactById = async (contactId) => await Contacts.findByPk(contactId);

const removeContact = async (id) => await Contacts.destroy({ where: { id } });

const addContact = async(data) => await Contacts.create(data);

const updateContact = async(id, data) => await Contacts.update(data, { where: { id } });

export {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact
}
