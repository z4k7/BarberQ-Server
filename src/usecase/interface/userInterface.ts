import IUser from "../../domain/user";

interface UserInterface{
    save(user: IUser): Promise<any>
    findByEmail(email: string): Promise<any>
    findUserById(user: string): Promise<any>  
}

export default UserInterface