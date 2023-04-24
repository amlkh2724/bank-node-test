import express from "express";
import {
  checkRegister,
  getaAllUsers,
  login,
  getSpecificUser
} from "../controllers/updateDbWhight.js";

const router = express.Router();
router.route("/").get(getaAllUsers);
router.route("/register").post(checkRegister);
router.route("/login").post(login);
router.route('/userbyid/:id').get(getSpecificUser)
 
export default router;
