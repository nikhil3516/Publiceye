package com.publiceye.app.data.model

import androidx.compose.ui.graphics.Color

data class Complaint(
    val id: String,
    val category: String,
    val severity: String,
    val title: String,
    val description: String,
    val status: String,
    val address: String,
    val ward: String,
    val upvoteCount: Int,
    val createdAt: String
)

object MockData {
    val userStats = mapOf(
        "totalComplaints" to 12,
        "resolved" to 8,
        "points" to 450,
        "level" to "Active Citizen"
    )

    val badges = listOf(
        Badge("first", "First Report", "🎯", true),
        Badge("starter", "Civic Starter", "⭐", true),
        Badge("area", "Area Hero", "🏆", false)
    )

    val statusColors = mapOf(
        "submitted" to Color(0xFFDBEAFE),
        "in_progress" to Color(0xFFFEF3C7),
        "resolved" to Color(0xFFDCFCE7)
    )

    val severityColors = mapOf(
        "low" to Color(0xFF2563EB),
        "medium" to Color(0xFFD97706),
        "high" to Color(0xFFDC2626)
    )
}

data class Badge(val id: String, val name: String, val icon: String, val earned: Boolean)
