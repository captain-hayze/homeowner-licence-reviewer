type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    phoneNumber: string;
    status: string;
    amountPayable: string;
    totalPaid: string;
    currentBalance: string;
    totalEarned: string;
    reviewTeamId: string | null;
    payoutFrequency: string;
    invitation: string | null;
    nextPayoutDate: string | null;
    available: boolean;
    licenseUserType: 'APPR' | 'STRUCT' | 'ARCH' | 'ADMIN';
    documents: Document[];
}

type Document = {
    name: string;
    url: string;
    uploadedAt: string;
}