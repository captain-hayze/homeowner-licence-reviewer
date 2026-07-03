import { Suspense } from "react";
import ReviewerLayout from "../../../components/layouts/ReviewerLayout";
import ReviewDetails from "@/components/reviews/ReviewDetails";
import { getRequestSignature } from "@/utils/get-request-signature";


export const dynamic = "force-static";

export async function generateStaticParams() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/license-review-user/all-assigned-review-requests`,
    {
      headers: {
        "X-Signature": getRequestSignature(
          "GET",
          "",
        ),
      },
      cache: "force-cache",
    }
  );
  const json = await response.json();
  const reviews: Review[] = json?.data ?? [];
  
  return reviews.map((review) => ({
    id: review.id,
  }));
}

export default async function ReviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const slug = await params;
  const reviewId = slug.id;
  return (
    <ReviewerLayout>
      <Suspense>
        <ReviewDetails reviewId={reviewId} />
      </Suspense>
    </ReviewerLayout>
  );
}
