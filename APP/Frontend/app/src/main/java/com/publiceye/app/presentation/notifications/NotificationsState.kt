package com.publiceye.app.presentation.notifications

import com.publiceye.app.domain.model.Notification

data class NotificationsState(
    val unreadNotifications: List<Notification> = emptyList(),
    val readNotifications: List<Notification> = emptyList(),
    val isUnreadTabSelected: Boolean = true,
    val isLoading: Boolean = false,
    val error: String? = null
)
