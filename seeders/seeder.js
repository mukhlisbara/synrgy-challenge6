import User from "../models/User.js";
import { UserSeeder } from "./user.js";

User.destroy({truncate: true})
UserSeeder()