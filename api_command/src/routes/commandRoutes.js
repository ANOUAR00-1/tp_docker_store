import express from 'express';
import { createCommand, getCommands, deleteCommand } from "../controller/commandController.js";

const router = express.Router();

router.post('/', createCommand);
router.get('/', getCommands);
router.delete('/:id', deleteCommand);

export default router;