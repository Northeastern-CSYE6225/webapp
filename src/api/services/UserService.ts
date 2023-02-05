import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel";

interface UserParams {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

class UserService {
  constructor() {}

  findByUsername = async (username: string, includePassword = false) => {
    const attributes = includePassword ? { include: ["password"] } : { exclude: ["password"] };

    return await UserModel.findOne({
      where: { username },
      attributes,
    });
  };

  create = async (params: UserParams): Promise<UserModel> => {
    const { username, password, first_name, last_name } = params;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let user = await UserModel.create({ username, password: hash, first_name, last_name });
    user = user.toJSON();
    delete user.password;
    return user;
  };
}

export default UserService;