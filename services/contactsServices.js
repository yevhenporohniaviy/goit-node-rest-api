import User from "../db/models/Contacts.js";

const listContacts = (query = {}, pagination = {}) => {
	const { page, limit } = pagination;
	const normalizedLimit = Number(limit);
	const offset = (Number(page) - 1) * normalizedLimit;
	return User.findAll({
		where: query,
		limit: normalizedLimit,
		offset,
	});
};

const getContactById = (contactId) => User.findByPk(contactId);

const removeContact = async (id) => {
	const contactPreparedToDeletion = await getContactById(id);

	const deletedContactStatus = await User.destroy({
		where: {
			id,
		},
	});

	return deletedContactStatus ? contactPreparedToDeletion : null;
};

const addContact = (data) => User.create(data);

const renewContact = async (id, data) => {
	const contactUpdateStatus = await User.update(data, {
		where: {
			id,
		},
	});

	return contactUpdateStatus ? await getContactById(id) : null;
};

const updateStatusContact = async (id, data) => {
	const contactUpdateStatus = await User.update(
		{ favorite: data.favorite },
		{
			where: {
				id,
			},
		},
	);

	return contactUpdateStatus ? await getContactById(id) : null;
};

export {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	renewContact,
	updateStatusContact,
};
