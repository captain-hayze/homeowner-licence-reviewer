import { useParams } from "react-router-dom";
import ReviewerLayout from "../../../components/layouts/ReviewerLayout";
import ReviewDetails from "../../../components/reviews/ReviewDetails";

export default function ReviewDetailPage() {
  const params = useParams(); 
  const reviewId = params.id!;
  return (
    <ReviewerLayout>
      <ReviewDetails reviewId={reviewId} />
    </ReviewerLayout>
  );
}
