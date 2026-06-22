import { createBrowserRouter, Navigate } from 'react-router';
import { Onboarding } from '@/pages/Onboarding';
import { Portal } from '@/pages/Portal';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { Home } from '@/pages/Home';
import { RootLayout } from '@/components/RootLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ReportIssue } from '@/pages/ReportIssue';
import { ComplaintsList } from '@/pages/ComplaintsList';
import { ComplaintDetail } from '@/pages/ComplaintDetail';
import { Profile } from '@/pages/Profile';
import { Notifications } from '@/pages/Notifications';
import { ChangeLanguage } from '@/pages/ChangeLanguage';
import { AdminLogin } from '@/pages/AdminLogin';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { Rewards } from '@/pages/Rewards';
import { Leaderboard } from '@/pages/Leaderboard';
import { Analytics } from '@/pages/Analytics';
import { VotedComplaintsMockup } from '@/pages/mockups/VotedComplaintsMockup';
import { PostedMockup } from '@/pages/mockups/PostedMockup';
import { NearbyComplaintsMockup } from '@/pages/mockups/NearbyComplaintsMockup';
import { CityComplaintsMockup } from '@/pages/mockups/CityComplaintsMockup';
import { YourActivityMockup } from '@/pages/mockups/YourActivityMockup';
import { SearchComplaintsMockup } from '@/pages/mockups/SearchComplaintsMockup';
import { MockupsGallery } from '@/pages/mockups/MockupsGallery';
import { ProfileMockup } from '@/pages/mockups/ProfileMockup';
import { ProfilePhotoMockup } from '@/pages/mockups/ProfilePhotoMockup';
import { EditProfileMockup } from '@/pages/mockups/EditProfileMockup';
import { ChangeLanguageMockup } from '@/pages/mockups/ChangeLanguageMockup';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Onboarding />,
  },
  {
    path: '/portal',
    element: <Portal />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'report',
        element: <ReportIssue />,
      },
      {
        path: 'complaints',
        element: <ComplaintsList />,
      },
      {
        path: 'complaints/:id',
        element: <ComplaintDetail />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'change-language',
        element: <ChangeLanguage />,
      },
      {
        path: 'rewards',
        element: <Rewards />,
      },
      {
        path: 'leaderboard',
        element: <Leaderboard />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'complaints/voted',
        element: <VotedComplaintsMockup />,
      },
      {
        path: 'complaints/posted',
        element: <PostedMockup />,
      },
      {
        path: 'complaints/nearby',
        element: <NearbyComplaintsMockup />,
      },
      {
        path: 'complaints/city',
        element: <CityComplaintsMockup />,
      },
      {
        path: 'complaints/activity',
        element: <YourActivityMockup />,
      },
      {
        path: 'complaints/search',
        element: <SearchComplaintsMockup />,
      },
      {
        path: 'complaints/mockups',
        element: <MockupsGallery />,
      },
      {
        path: 'complaints/profile-mockup',
        element: <ProfileMockup />,
      },
      {
        path: 'complaints/profile-photo-mockup',
        element: <ProfilePhotoMockup />,
      },
      {
        path: 'complaints/edit-profile-mockup',
        element: <EditProfileMockup />,
      },
      {
        path: 'complaints/change-language-mockup',
        element: <ChangeLanguageMockup />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
], { basename: import.meta.env.BASE_URL });
