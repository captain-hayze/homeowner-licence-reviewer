import ReviewerLayout from './ReviewerLayout';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <ReviewerLayout>
      <Outlet />
    </ReviewerLayout>
  )
}
