import { Request, Response } from "express";
import ReviewUsecase from "../usecase/reviewUsecase";

class ReviewController {
  constructor(private revieUsecase: ReviewUsecase) {}

  async addReview(req: Request, res: Response) {
    try {
      const salonId = req.query.salonId as string;
      const review = req.body;

      const addedReview = await this.revieUsecase.addReview(salonId, review);

      res.status(addedReview.status).json(addedReview);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async getReviews(req: Request, res: Response) {
    try {
      const salonId = req.query.salonId as string;
      const reviews = await this.revieUsecase.getReviews(salonId);
      res.status(reviews.status).json(reviews);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async getAverage(req: Request, res: Response) {
    try {
      console.log(`Salon id in get average`, req.query);
      const salonId = req.query.salonId as string;
      const averageRating = await this.revieUsecase.getAverage(salonId);
      res.status(averageRating.status).json(averageRating);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async userInBooking(req: Request, res: Response) {
    try {
      const salonId = req.query.salonId as string;
      const userId = req.body;

      const userFound = await this.revieUsecase.userInBooking(salonId, userId);

      res.status(userFound.status).json(userFound);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async findReview(req: Request, res: Response) {
    try {
      const salonId = req.query.salonId as string;
      const userId = req.body;

      const reviewFound = await this.revieUsecase.findReview(salonId, userId);

      res.status(reviewFound.status).json(reviewFound);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }

  async editReview(req: Request, res: Response) {
    try {
      const salonId = req.query.salonId as string;
      const review = req.body;

      const editedReview = await this.revieUsecase.editReview(salonId, review);

      res.status(editedReview.status).json(editedReview);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }
}

export default ReviewController;
