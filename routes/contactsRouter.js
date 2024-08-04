import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavoriteStatus
} from "../controllers/contactsControllers.js";
import validateBody from "../decorators/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const addMiddleWare = validateBody(createContactSchema);
const updMiddleWare = validateBody(updateContactSchema);
const favoriteMiddleware = validateBody(updateFavoriteSchema);

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", addMiddleWare, createContact);

contactsRouter.put("/:id", updMiddleWare, updateContact);

contactsRouter.patch("/:id", updMiddleWare, updateContact);

contactsRouter.patch(
  "/:id/favorite",
  favoriteMiddleware,
  updateFavoriteStatus
);

export default contactsRouter;
