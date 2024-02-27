import IUser from "../../domain/user";
import UserModel from "../database/userModel";
import UserInterface from "../../usecase/interface/userInterface";

class UserRepository implements UserInterface {
  // *Saving the user in database
  async saveUser(user: IUser): Promise<any> {
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

  async findAllUsersWithCount(
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<any> {
    try {
      const regex = new RegExp(searchQuery, "i");

      const pipeline = [
        {
          $match: {
            $or: [
              { name: { $regex: regex } },
              { email: { $regex: regex } },
              { mobile: { $regex: regex } },
            ],
          },
        },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            paginatedResults: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              { $project: { password: 0 } },
            ],
          },
        },
      ];
      const [result] = await UserModel.aggregate(pipeline).exec();

      console.log(`result after aggregation`, result);

      const users = result.paginatedResults;
      const userCount =
        result.totalCount.length > 0 ? result.totalCount[0].count : 0;

      return {
        users,
        userCount,
      };
    } catch (error) {
      console.log(error);
      throw Error("Error while getting user data");
    }
  }

  async blockUnblockUser(userId: string): Promise<any> {
    const userFound = await UserModel.findById(userId);
    console.log(`inside repository`, userFound);
    if (userFound) {
      userFound.isBlocked = !userFound.isBlocked;
      return userFound.save();
    } else {
      throw Error("User not found");
    }
  }
}

export default UserRepository;
