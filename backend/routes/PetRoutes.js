const express = require("express");
const router = express.Router();
const PetController = require("../controllers/PetController");
const { imageUpload } = require("../helpers/image-upload");

//middlewares
const verifyToken = require("../helpers/verify-token");

router.get("/", PetController.getAll)
router.get('/mypets', verifyToken, PetController.getAllUserPets)
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)
router.get('/:id', PetController.getPetById)
router.patch("/:id", verifyToken, imageUpload.array('images'), PetController.updatePet)
router.delete("/:id",verifyToken , PetController.removePetById)
router.post("/create", verifyToken, imageUpload.array("images"), PetController.create);

module.exports = router;
