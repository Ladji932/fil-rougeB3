const express = require("express");
const router = express.Router();
const cors = require("cors");
const {showQrCode, Signup, Login} = require("../controller/userController")


router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());


router.get("/", function(req, res) {res.send("Accueil");});
router.get("/qrcode/:username/:email", showQrCode);
router.post("/fetchSignup", Signup);
router.post("/loginManage",Login);

module.exports = router;
