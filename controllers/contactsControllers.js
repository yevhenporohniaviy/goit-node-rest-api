import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res, next) => {
	try {
		const result = await contactsService.listContacts();
		if (!result) {
			throw HttpError(404);
		}
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const getOneContact = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await contactsService.getContactById(id);
		if (!result) {
			throw HttpError(404);
		}
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteContact = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await contactsService.removeContact(id);
		if (!result) {
			throw HttpError(404);
		}
		res.json({
			"removed": !!result,
		});
	} catch (error) {
		next(error);
	}
};

export const createContact = async (req, res, next) => {
	try {
		const result = await contactsService.addContact(req.body);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updateContact = async (req, res, next) => {
	try {
		const { id } = req.params;

		if (Object.keys(req.body).length === 0) {
			throw HttpError(400, 'Body must have at least one field');
		}

		const [updated] = await contactsService.updateContact(id, req.body);

		if (!updated) {
			throw HttpError(404);
		}
		const updatedContact = await contactsService.getContactById(id);
		res.status(200).json(updatedContact);
	} catch (error) {
		next(error);
	}
};

export const updateFavoriteStatus = async (req, res, next) => {
	try {

		const id = req.params.id;
		const [updated] = await contactsService.updateContact(id, req.body);

		if (!updated) {
			throw HttpError(404);
		}
		const updatedContact = await contactsService.getContactById(id);
		res.status(200).json(updatedContact);
	} catch (error) {
		next(error);
	}
};
