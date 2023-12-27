const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  createAdminUser,
  getAllUsers,
  deleteUser,
  updateAdminUser,
} = require("../controller/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();
const upload = require("../utils/fileUpload");

router.post("/register", upload.single("image"), registerUser);
router.get("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);
router.get("/loginStatus", loginStatus);
router.put("/updateUser", protect, upload.single("image"), (req, res) => {
  console.log("Reached updateUser route");
  updateUser(req, res);
});
router.post("/users", protect, adminOnly, createAdminUser);
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/users/:id", protect, adminOnly, updateAdminUser);

module.exports = router;
