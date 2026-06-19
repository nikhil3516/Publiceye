package com.publiceye.app.presentation.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Onboarding : Screen("onboarding")
    object Login : Screen("login")
    object Register : Screen("register")
    object ForgotPassword : Screen("forgot_password")
    object AdminLogin : Screen("admin_login")
    object AdminDashboard : Screen("admin_dashboard")
    object Home : Screen("home")
    object Rewards : Screen("rewards")
    object Notifications : Screen("notifications")
    object Profile : Screen("profile")
    object EditProfile : Screen("edit_profile")
    object ChangeLanguage : Screen("change_language")
    object Complaints : Screen("complaints")
    object PostedComplaints : Screen("posted_complaints")
    object VotedComplaints : Screen("voted_complaints")
    object NearbyComplaints : Screen("nearby_complaints")
    object CityComplaints : Screen("city_complaints")
    object YourActivity : Screen("your_activity")
    object SearchComplaints : Screen("search_complaints")
    object ReportIssue : Screen("report_issue")
    object SubmitComplaint : Screen("submit_complaint/{category}") {
        fun createRoute(category: String) = "submit_complaint/$category"
    }
    object Survey : Screen("survey")
    object FindFacilities : Screen("find_facilities")
    object RateServices : Screen("rate_services")
    object TrackComplaint : Screen("track_complaint")
    object CommunityUpdates : Screen("community_updates")
}
