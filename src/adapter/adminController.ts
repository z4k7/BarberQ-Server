import { Request, Response } from "express";
import AdminUsecase from "../usecase/adminUsecase";
import IAdmin from "../domain/admin";

class AdminController {
  constructor(private adminUsecase: AdminUsecase) {}

  async adminLogin(req: Request, res: Response) {
    try {
      const admin = req.body;
      const adminData = await this.adminUsecase.adminLogin(admin);

      return res.status(adminData.status).json(adminData);
    } catch (error) {
      console.log(`Error in login:`, error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }


  async getUsers(req: Request, res: Response) {
  try {
    const usersList = await this.adminUsecase.getUsers();

    return res.status(usersList.status).json(usersList)
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message:"Internal Server Error",
      error:(error as Error).message,
    })
  }
  }
  
  async blockUnblockUser(req: Request, res: Response) {
  try {
    console.log('Inside Controller')
    const user = await this.adminUsecase.blockUnblockUser(req.params.id)

    return res.status(user.status).json(user)
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",    
      error:(error as Error).message
    })
  }
}


}

export default AdminController; 
