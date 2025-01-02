const express = require("express");
const router = express.Router();
const cors = require("cors");
const { showQrCode, Signup,DeleteUser, Login } = require("../controller/userController");
const { CreateEvents, upload, fetchEvents } = require("../controller/userAdmin"); 

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());

router.get("/", function(req, res) {
  res.send("Accueil");
});
router.get("/qrcode/:username/:email", showQrCode);
router.post("/fetchSignup", Signup);
router.post("/loginManage", Login);
router.post("/createEvent", upload, CreateEvents); 
router.get("/fetch-events",fetchEvents)
router.delete("/user/:_id", DeleteUser);

module.exports = router;
