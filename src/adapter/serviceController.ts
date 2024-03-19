import { Request, Response } from "express";
import ServiceUsecase from "../usecase/serviceUsecase";
import IService from "../domain/services";

class ServiceController {
  constructor(private serviceUsecase: ServiceUsecase) {}

  async addService(req: Request, res: Response) {
    try {
      console.log("req.body", req.body);
      const serviceExistence = await this.serviceUsecase.isServiceExist(
        req.body.serviceName
      );

      if (serviceExistence.data) {
        console.log(`inside serviceExist`, serviceExistence.data);
        return res
          .status(401)
          .json({ data: false, message: "Service already exists" });
      }
      const savedService = await this.serviceUsecase.saveService(req.body);
      return res.status(201).json({
        data: savedService,
        message: "Service Added Successfully",
      });
    } catch (error) {
      console.log(`Error while adding Service`, error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async editService(req: Request, res: Response) {
    try {
      const updatedService = await this.serviceUsecase.editService(req.body);

      return res.status(updatedService.status).json(updatedService);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async getAllServices(req: Request, res: Response) {
    try {
      console.log(`Inside vendorCOntroller`);
      const serviceList = await this.serviceUsecase.getAllServices();
      return res.status(serviceList.status).json(serviceList);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async getServices(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;

      const serviceList = await this.serviceUsecase.getServices(
        page,
        limit,
        searchQuery
      );
      return res.status(serviceList.status).json(serviceList);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async hideService(req: Request, res: Response) {
    try {
      console.log(`Inside Controller`);
      const serviceFound = await this.serviceUsecase.hideService(req.params.id);
      return res.status(serviceFound.status).json(serviceFound);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Error",
        error: (error as Error).message,
      });
    }
  }
}
export default ServiceController;
