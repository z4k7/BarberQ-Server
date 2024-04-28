"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../database/userModel"));
class UserRepository {
    // *Saving the user in database
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const User = new userModel_1.default(user);
            const savedUser = yield User.save()
                .then((res) => {
                console.log(`success`, res);
                return res;
            })
                .catch((error) => {
                console.log(error);
            });
            return savedUser;
        });
    }
    // *Checking if the given email already exists in db
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield userModel_1.default.findOne({ email });
            return userFound;
        });
    }
    // *Finding the user by ID
    findUserById(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield userModel_1.default.findById(user);
            return userFound;
        });
    }
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield userModel_1.default.find();
            return allUsers;
        });
    }
    findAllUsersWithCount(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const [result] = yield userModel_1.default.aggregate(pipeline).exec();
                console.log(`result after aggregation`, result);
                const users = result.paginatedResults;
                const userCount = result.totalCount.length > 0 ? result.totalCount[0].count : 0;
                return {
                    users,
                    userCount,
                };
            }
            catch (error) {
                console.log(error);
                throw Error("Error while getting user data");
            }
        });
    }
    blockUnblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield userModel_1.default.findById(userId);
            console.log(`inside repository`, userFound);
            if (userFound) {
                userFound.isBlocked = !userFound.isBlocked;
                return userFound.save();
            }
            else {
                throw Error("User not found");
            }
        });
    }
}
exports.default = UserRepository;
