import React from "react"
import { Card, Row, Col, Skeleton, Button } from "antd"
import useSWR from "swr";
import { CloseCircleOutlined } from "@ant-design/icons";
import DocumentCard from "./DocumentCard";
import CommentList from "./CommentList";
import { fetcher } from "../../utils/axios";

interface ReviewDetailsProps {
  reviewId: string;
}

export default function ReviewDetails({ reviewId }: ReviewDetailsProps) {
  const id = reviewId;
  const [selectedDocument, setSelectedDocument] = React.useState<ReviewDocument | null>(null);

  const { data, isLoading, mutate } = useSWR(`/license-review-user/${id}/assigned-review-request`, fetcher);

  const review: Review = React.useMemo(() => {
    return data?.data || undefined;
  }, [data]);
  return (
    <>
      <Row gutter={16}>
        <Col span={selectedDocument ? 16 : 24}>
          <Card title={`${review?.reviewPlan?.title || "Review Details"}`}>
            {isLoading
              ? <Skeleton />
              : (<>
                 <p className="mb-6 text-gray-700">
                  {review?.reviewPlan.description || "No description provided for this review."}
                 </p>
                <div className="space-y-3">
                  {review?.requestDocuments.map((doc, idx) => (
                    <DocumentCard
                      key={idx}
                      onSelect={(document) => setSelectedDocument(document)}
                      reviewId={review.id}
                      onApproved={mutate}
                      {...doc}
                    />
                  ))}
                </div>
              </>)}
            {!isLoading && !review && (
              <p className="text-center text-gray-500 py-10">
                No review data found.
              </p>
            )}
          </Card>
        </Col>
        {selectedDocument && (
          <Col span={8}>
            <Card
              title="Comments"
              extra={<Button
                size="small"
                icon={<CloseCircleOutlined className="text-lg!" />}
                variant="text"
                onClick={() => setSelectedDocument(null)}
              />
              }
            >
              <CommentList
                documentId={selectedDocument?.licenseReviewPlanDocumentId}
                reviewId={review?.id}
                comments={selectedDocument.comments}
                reuploadRemark={selectedDocument.reuploadRemark}
                onReuploadRequest={(remark) => {
                  mutate();
                  setSelectedDocument((prev) => prev ? { ...prev, reuploadRemark: remark } : prev);
                }}
              />
            </Card>
          </Col>
        )}
      </Row>
    </>
  )
}
