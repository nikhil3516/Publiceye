package com.publiceye.app.presentation.components

import androidx.annotation.StringRes
import androidx.annotation.DrawableRes
import com.publiceye.app.R

sealed class BottomNavItem(
    val route: String,
    @StringRes val titleRes: Int,
    @DrawableRes val iconRes: Int
) {
    object Home : BottomNavItem("home", R.string.nav_home, R.drawable.ic_home)
    object Complaints : BottomNavItem("complaints", R.string.nav_complaints, R.drawable.ic_file_text)
    object Notifications : BottomNavItem("notifications", R.string.nav_notifications, R.drawable.ic_bell)
    object Rewards : BottomNavItem("rewards", R.string.nav_rewards, R.drawable.ic_award)
    object Profile : BottomNavItem("profile", R.string.nav_profile, R.drawable.ic_user)
}
