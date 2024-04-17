import { Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import SalonUsecase from "../usecase/salonUsecase";
import ServiceUsecase from "../usecase/serviceUsecase";
import RazorpayClass from "../infrastructure/utils/razorpay";

class SalonController {
  razorpay = new RazorpayClass();

  constructor(
    private salonUsecase: SalonUsecase,
    private serviceUsecase: ServiceUsecase
  ) {}

  async addSalon(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;
      if (token) {
        const decoded = verify(
          token.slice(7),
          process.env.JWT_KEY as string
        ) as JwtPayload;
        let vendorId = decoded.id;

        const banners = req.files;
        const facilities = JSON.parse(req.body.facilities);
        const location = JSON.parse(req.body.location);

        const {
          salonName,
          landmark,
          locality,
          district,
          openingTime,
          closingTime,
          contactNumber,
          chairCount,
          services,
        } = req.body;

        const salonData = {
          vendorId: vendorId,
          salonName,
          landmark,
          locality,
          location,
          district,
          openingTime,
          closingTime,
          contactNumber,
          chairCount,
          facilities,
          banners,
          services,
        };

        const salonAdd = await this.salonUsecase.addSalon(salonData);
        res.status(200).json(salonAdd);
      }
    } catch (error) {
      console.log(`Error`, error);
    }
  }

  async updateSalonStatus(req: Request, res: Response) {
    try {
      const salonId = req.params.salonId as string;
      const status = req.body.status;

      const salonDetails = await this.salonUsecase.updateSalonStatus(
        salonId,
        status
      );

      return res.status(salonDetails.status).json(salonDetails);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async getSalonById(req: Request, res: Response) {
    try {
      const salonId = req.params.salonId as string;

      const salonDetails = await this.salonUsecase.getSalonById(salonId);

      return res.status(salonDetails.status).json(salonDetails);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async updateSalonServices(req: Request, res: Response) {
    try {
      const salonId = req.params.salonId;
      const services = req.body;

      const updatedSalon = await this.salonUsecase.updateSalonServices(
        salonId,
        services
      );

      res.status(200).json(updatedSalon);
    } catch (error) {
      console.error("Error updating salon services:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async updateSalon(req: Request, res: Response) {
    try {
      const salonId = req.params.salonId;
      const update = req.body;

      const updatedSalon = await this.salonUsecase.updateSalon(salonId, update);

      res.status(200).json(updatedSalon);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async editSalonServices(req: Request, res: Response) {
    try {
      const salonId = req.params.salonId;
      const servicesToEdit = req.body;

      const updatedSalon = await this.salonUsecase.editSalonServices(
        salonId,
        servicesToEdit
      );
      res.status(200).json(updatedSalon);
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async getSalons(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;
      const vendorId = req.params.vendorId as string | undefined;

      const salonList = await this.salonUsecase.getSalons(
        page,
        limit,
        vendorId,
        searchQuery
      );
      return res.status(salonList.status).json(salonList);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async getActiveSalons(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchQuery = req.query.searchQuery as string | undefined;

      const activeSalons = await this.salonUsecase.getActiveSalons(
        page,
        limit,
        searchQuery
      );

      res.status(200).json(activeSalons);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async getSalonDetaills(req: Request, res: Response) {
    try {
      const salonId = req.params.salonId as string;

      const salonDetails = await this.salonUsecase.getSalonById(salonId);
      return res.status(200).json(salonDetails);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async getServicesByIds(req: Request, res: Response) {
    try {
      const serviceIds = JSON.parse(req.query.serviceIds as string) as string[];

      const services = await this.serviceUsecase.getServicesByIds(serviceIds);

      res.status(200).json({ services });
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async deleteSalonServices(req: Request, res: Response) {
    const { salonId } = req.params;
    const { serviceIds } = req.body;

    try {
      const result = await this.salonUsecase.deleteSalonServices(
        salonId,
        serviceIds
      );

      return res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async createPaymentOrder(req: Request, res: Response) {
    const { amount } = req.body;

    try {
      const order = await this.razorpay.createOrder(amount);
      res.status(200).json({ order });
    } catch (error) {
      console.error("Error creating payment order", error);
      res.status(500).json({ message: "Failed to create payment order" });
    }
  }

  async verifyPayment(req: Request, res: Response) {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    try {
      const isPaymentVerified = await this.razorpay.verifyPayment(
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      );
      if (isPaymentVerified) {
        res.status(200).json({ message: "Payment verified successfully" });
      } else {
        res.status(400).json({ message: "Payment verification failed" });
      }
    } catch (error) {
      console.error("Error verifying payment", error);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  }

  async getVendorDashboardData(req: Request, res: Response) {
    try {
      const vendorId = req.params.vendorId;
      const dashboardData = await this.salonUsecase.getVendorDashboardData(
        vendorId
      );
      return res.status(dashboardData.status).json(dashboardData);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async getSalonDashboardData(req: Request, res: Response) {
    try {
      const salonId = req.params.salonId;
      const dashboardData = await this.salonUsecase.getSalonDashboardData(
        salonId
      );
      return res.status(dashboardData.status).json(dashboardData);
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

export default SalonController;
