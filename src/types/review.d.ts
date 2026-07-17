
type HomeOwnerProject = {
  id: string;
  name: string;
  publicId: string;
}

type ReviewComment = {
  user: string;
  text: string;
}

type ReviewDocument = {
  id: string;
  licenseReviewPlanDocumentId: string;
  title: string;
  documentUrl: string;
  reviewStatus: 'ARCH_REVIEW' | 'IN_REVIEW' | 'COMPLETED' | 'STRUCT_REVIEW';
  reuploadedAt: string | null;
  reuploadRequestedAt: string | null;
  reuploadRemark: string | null;
  requiresReupload: boolean;
  comments: ReviewComment[];
  planDocument: {
    id: string;
    title: string;
  }
}

type Plan = {
  id: string;
  title: string;
  price: string;
  apprReviewerPercentage: string;
  archReviewerPercentage: string;
  structReviewerPercentage: string;
  description: string;
}

type Review = {
  id: string;
  title: string;
  status: "ARCH_REVIEW" | "IN_REVIEW" | "COMPLETED"  | 'PENDING_DOCUMENTS';
  reviewPlan: Plan;
  requestDocuments: ReviewDocument[];
  comments: ReviewComment[];
  homeOwnerProject: HomeOwnerProject;
  createdAt: string;
  updatedAt: string;
}

type ReviewRequest = {
  id: string;
  reviewRequest: Review;
  createdAt: string;
  assignedTime: string;
  updatedAt: string;
}