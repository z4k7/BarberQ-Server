import IUser from "../../domain/user";
import UserModel from "../database/userModel";
import UserInterface from "../../usecase/interface/userInterface";

class UserRepository implements UserInterface {
  // *Saving the user in database
  async save(user: IUser): Promise<any> {
    const User = new UserModel(user);
    const savedUser = await User.save()
      .then((res) => {
        console.log(`success`, res);
        return res;
      })
      .catch((error) => {
        console.log(error);
      });
    return savedUser;
  }

  // *Checking if the given email already exists in db
  async findByEmail(email: string): Promise<any> {
    const userFound = await UserModel.findOne({ email });
    return userFound;
  }

  // *Finding the user by ID
  async findUserById(user: string): Promise<any> {
    const userFound = await UserModel.findById(user);
    return userFound;
  }

  async findAllUsers(): Promise<any> {
    const allUsers = await UserModel.find();
    return allUsers;
  }

  async blockUnblockUser(userId: string): Promise<any> {
    const userFound = await UserModel.findById(userId);
    console.log(`inside repository`, userFound);
if(userFound){
  userFound.isBlocked = !userFound.isBlocked;
  return userFound.save()
}else{
  throw Error("User not found")
}
  }
}

export default UserRepository;
