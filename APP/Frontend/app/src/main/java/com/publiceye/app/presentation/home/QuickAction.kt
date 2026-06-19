package com.publiceye.app.presentation.home

import androidx.annotation.StringRes
import androidx.annotation.DrawableRes
import androidx.compose.ui.graphics.Color
import com.publiceye.app.R

data class QuickAction(
    @StringRes val titleRes: Int,
    @StringRes val descriptionRes: Int,
    @DrawableRes val iconRes: Int,
    val route: String,
    val gradientColors: Pair<Color, Color>
)

val quickActions = listOf(
    QuickAction(
        R.string.report_issue,
        R.string.report_issue_desc,
        R.drawable.ic_alert_circle,
        "report",
        Pair(Color(0xFF14B8A6), Color(0xFF0D9488))
    ),
    QuickAction(
        R.string.citizen_feedback,
        R.string.citizen_feedback_desc,
        R.drawable.ic_message_square,
        "survey",
        Pair(Color(0xFFF97316), Color(0xFFEA580C))
    ),
    QuickAction(
        R.string.find_facilities,
        R.string.find_facilities_desc,
        R.drawable.ic_map_pin,
        "find-facilities",
        Pair(Color(0xFF22C55E), Color(0xFF16A34A))
    ),
    QuickAction(
        R.string.rate_services,
        R.string.rate_services_desc,
        R.drawable.ic_star,
        "rate-services",
        Pair(Color(0xFF14B8A6), Color(0xFF06B6D4))
    ),
    QuickAction(
        R.string.live_tracking,
        R.string.live_tracking_desc,
        R.drawable.ic_file_text,
        "live-tracking",
        Pair(Color(0xFFF97316), Color(0xFFEC4899))
    ),
    QuickAction(
        R.string.community_updates,
        R.string.community_updates_desc,
        R.drawable.ic_users,
        "community-updates",
        Pair(Color(0xFF22C55E), Color(0xFF14B8A6))
    )
)
