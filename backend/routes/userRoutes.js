const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { authorize } = require('../middleware/roleMiddleware');

router.get('/', authorize(['admin']), getAllUsers);
router.get('/:id', authorize(['admin']), getUserById);
router.post('/', authorize(['admin']), createUser);
router.put('/:id', authorize(['admin']), updateUser);
router.delete('/:id', authorize(['admin']), deleteUser);

module.exports = router;
