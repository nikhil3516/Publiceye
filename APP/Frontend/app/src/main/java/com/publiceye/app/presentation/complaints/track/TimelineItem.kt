package com.publiceye.app.presentation.complaints.track

data class TimelineItem(
    val stage: String,
    val description: String,
    val timestamp: String,
    val status: TimelineStatus
)

enum class TimelineStatus {
    COMPLETED, ACTIVE, PENDING
}
