import path from "path"
import fs from "fs/promises";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));


async function listContacts() {
	const data = await fs.readFile(contactsPath);
	return JSON.parse(data);
}

async function getContactById(contactId) {
	const contacts = await listContacts();
	const result = contacts.find(({id}) => id === contactId);
	return result || null;
}

async function removeContact(contactId) {
	const contacts = await listContacts();
	const index = contacts.findIndex(({id}) => id === contactId);

	if(index === -1) {
		return null;
	}

	const [result] = contacts.splice(index, 1);
	await updateContacts(contacts);

	return result;
}

async function addContact(data) {
	const contacts = await listContacts();
	const newContact = {
		id: nanoid(),
		...data
	};
	contacts.push(newContact);
	await updateContacts(contacts);

	return newContact;
}

async function updateContact(id, body)  {
	const contacts = await listContacts();
	const index = contacts.findIndex(item => item.id === String(id));
	if (index === -1) {
		return null;
	}

	contacts[index] = { ...contacts[index], ...body };
	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	return contacts[index];
}


export {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact
}
