import { Card, Avatar, Input, Button, message } from "antd";
import useSWRMutation from "swr/mutation";
import React from "react";
import { handleMutation } from "../../utils/axios";

interface CommentListProps {
  documentId: string;
  reviewId: string;
  comments?: ReviewComment[];
  reuploadRemark: string | null;
  onReuploadRequest?: (remark: string) => void;
}

export default function CommentList({
  documentId,
  reviewId,
  reuploadRemark,
  onReuploadRequest
}: CommentListProps) {
  const [commentText, setCommentText] = React.useState("");

  const { trigger: addComment, isMutating } = useSWRMutation(
    "/license-user/add-comment",
    handleMutation,
  );

  const handleSendComment = async () => {
    if (!commentText) return;
    try {
      await addComment({
        licenseReviewRequestId: reviewId,
        licenseReviewPlanDocumentId: documentId,
        remark: commentText,
      });
      setCommentText("");
      message.success("Comment added successfully");
      onReuploadRequest?.(commentText);
    } catch (error) {
      console.error("Error adding comment:", error);
      message.error("Failed to add comment. Please try again.");
    }
  };

  return (
    <div>
      <div className="space-y-4">
        {reuploadRemark ? (
          <Card size="small" className="border-gray-200 shadow-sm bg-yellow-50">
            <div className="flex items-start gap-3">
              <Avatar>!</Avatar>
              <div>
                <div className="font-semibold">Re-upload requested</div>
                <div className="text-sm text-gray-600">{reuploadRemark}</div>
              </div>
            </div>
          </Card>
        ) : <p className="text-sm text-gray-500">No comments yet. Add your feedback or request a re-upload.</p>}

        {/* {comments.map((item, index) => (
          <Card key={index} size="small" className="border-gray-200 shadow-sm">
            <div className="flex items-start gap-3">
              <Avatar>{item.user?.[0] || "?"}</Avatar>
              <div>
                <div className="font-semibold">{item.user}</div>
                <div className="text-sm text-gray-600">{item.text}</div>
              </div>
            </div>
          </Card>
        ))} */}
      </div>
      <div className="mt-4">
        <Input.TextArea
          placeholder="Add a comment or request re-upload"
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="mt-2 text-right">
          <Button
            type="primary"
            disabled={isMutating}
            loading={isMutating}
            onClick={handleSendComment}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
