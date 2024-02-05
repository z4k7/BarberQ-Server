import IUser from "../../domain/user";

interface UserInterface{
    save(user: IUser): Promise<any>
    // mobileExistCheck(mobile: string): Promise<any>
    findByEmail(email: string): Promise<any>
    findUserById(user: string): Promise<any>
    
    
}

export default UserInterface