import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../decorators/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const addMiddleWare = validateBody(createContactSchema);
const updMiddleWare = validateBody(updateContactSchema);
const favoriteMiddleware = validateBody(updateFavoriteSchema);

const contactsRouter = Router();
contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getContacts);

contactsRouter.get("/favorites", contactsControllers.getTrueFavorites);

contactsRouter.get("/:id", contactsControllers.getOneContact);

contactsRouter.post("/", addMiddleWare, contactsControllers.createContact);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.put(
  "/:id",
  updMiddleWare,
  contactsControllers.updateContactById
);

contactsRouter.patch(
  "/:id",
  updMiddleWare,
  contactsControllers.updateContactById
);

contactsRouter.patch(
  "/:id/favorite",
  favoriteMiddleware,
  contactsControllers.updateStatusContact
);

export default contactsRouter;
