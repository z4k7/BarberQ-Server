import { Request, Response } from "express";
import AdminUsecase from "../usecase/adminUsecase";

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
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;

      const usersList = await this.adminUsecase.getUsers(
        page,
        limit,
        searchQuery
      );

      return res.status(usersList.status).json(usersList);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async getVendors(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      const vendorsList = await this.adminUsecase.getVendors(
        page,
        limit,
        searchQuery
      );
      return res.status(vendorsList.status).json(vendorsList);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  // async getSalons(req: Request, res: Response) {
  //   try {
  //     const page = parseInt(req.query.page as string);
  //     const limit = parseInt(req.query.limit as string);
  //     const searchQuery = req.query.searchQuery as string | undefined;
  //     const salonList = await this.adminUsecase.getSalons(
  //       page,
  //       limit,
  //       searchQuery
  //     );

  //     console.log(`SalonList from admincontroller`, salonList);
  //     return res.status(salonList.status).json(salonList);
  //   } catch (error) {
  //     return res.status(500).json({
  //       status: 500,
  //       success: false,
  //       message: "Internal Server Error",
  //       error: (error as Error).message,
  //     });
  //   }
  // }

  async blockUnblockUser(req: Request, res: Response) {
    try {
      console.log("Inside Controller");
      const user = await this.adminUsecase.blockUnblockUser(req.params.id);

      return res.status(user.status).json(user);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async blockUnblockVendor(req: Request, res: Response) {
    try {
      const vendor = await this.adminUsecase.blockUnblockVendor(req.params.id);
      return res.status(vendor.status).json(vendor);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }
}

export default AdminController;
