import IAdmin from "../../domain/admin";

interface AdminInterface{
    findByEmail(email:string):Promise<any>
}

export default AdminInterface