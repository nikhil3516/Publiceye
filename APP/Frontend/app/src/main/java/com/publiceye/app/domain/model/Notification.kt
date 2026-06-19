package com.publiceye.app.domain.model

data class Notification(
    val id: String,
    val title: String,
    val description: String,
    val timeAgo: String,
    val type: NotificationType,
    val isRead: Boolean = false
)

enum class NotificationType {
    ACKNOWLEDGEMENT,
    STATUS_UPDATE,
    COMMUNITY_UPDATE,
    RESOLUTION,
    ANNOUNCEMENT
}
