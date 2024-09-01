import Contact from "../db/models/Contact.js";

export const getAllContacts = (query = {}, pagination = {}) => {
	const { page = 1, limit = 20 } = pagination;
	const normalizedLimit = Number(limit);
	const offset = (Number(page) - 1) * normalizedLimit;

	return Contact.findAll({
		where: query,
		offset,
		limit: normalizedLimit,
		order: [["id", "asc"]],
	});
};
export const getOneContact = (query) => Contact.findOne({ where: query });

export const createContact = (data) => Contact.create(data);

export const removeContact = async (query) => Contact.destroy({ where: query });

export const updateContact = async (query, updatedData) => {
	const contact = await getOneContact(query);
	if (!contact) {
		return null;
	}
	return Contact.update(updatedData, { returning: true });
};

export const updateStatusContact = async (id, { favorite }) => {
	await Contact.update({ favorite }, { where: { id } });

	return await getOneContact(id);
};
