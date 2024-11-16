import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth";
import { newReviewSchema, validate } from "@/middlewares/validator";
import { addReview, getReview } from "@/controllers/reivew";
import { Router } from "express";

const reviewRouter = Router();

reviewRouter.post("/", isAuth, validate(newReviewSchema), isPurchasedByTheUser, addReview);
reviewRouter.get("/:bookId", isAuth, getReview);

export default reviewRouter;
