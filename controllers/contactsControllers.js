import * as s from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import EmptyRequestBodyError from "../helpers/EmptyRequestBodyError.js";

const getContacts = async (req, res) => {
	const { id: owner } = req.user;
	const { page = 1, limit = 20 } = req.query;
	const result = await s.getAllContacts({ owner }, { page, limit });
	res.json(result);
};

const getTrueFavorites = async (req, res) => {
	const { id: owner } = req.user;
	const result = await s.getAllContacts({ owner, favorite: true });
	res.json(result);
};

const getOneContact = async (req, res) => {
	const { id } = req.params;
	const { id: owner } = req.user;

	const result = await s.getOneContact({ id, owner });
	if (!result) {
		throw HttpError(404, `Contact with id ${id} not found`);
	}
	res.json(result);
};

const deleteContact = async (req, res) => {
	const { id } = req.params;
	const { id: owner } = req.user;

	const result = await s.removeContact({ id, owner });
	if (!result) {
		throw HttpError(404, `Contact with id ${id} not found`);
	}

	res.json(`Contact with id ${id} removed successfuly`);
};

const createContact = async (req, res) => {
	const { id: owner } = req.user;

	const result = await s.createContact({ ...req.body, owner });
	res.status(201).json(result);
};

const updateContactById = async (req, res) => {
	const { id } = req.params;
	const { id: owner } = req.user;

	const updatedData = req.body;

	EmptyRequestBodyError(updatedData);

	const updatedContact = await s.updateContact({ id, owner }, updatedData);
	if (!updatedContact) {
		throw HttpError(404, `Contact with id: ${id} not found`);
	}
	res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
	const { id } = req.params;
	const { favorite } = req.body;
	const { id: owner } = req.user;

	EmptyRequestBodyError({ favorite });

	const updatedStatus = await s.updateContact({ id, owner }, { favorite });
	if (!updatedStatus) {
		throw HttpError(404, `Contact with id: ${id} not found`);
	}

	res.json(updatedStatus);
};

export default {
	getContacts: ctrlWrapper(getContacts),
	getOneContact: ctrlWrapper(getOneContact),
	deleteContact: ctrlWrapper(deleteContact),
	createContact: ctrlWrapper(createContact),
	updateContactById: ctrlWrapper(updateContactById),
	updateStatusContact: ctrlWrapper(updateStatusContact),
	getTrueFavorites: ctrlWrapper(getTrueFavorites),
};
