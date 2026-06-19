package com.publiceye.app.presentation.notifications

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.publiceye.app.data.remote.api.RetrofitClient
import com.publiceye.app.domain.model.Notification
import com.publiceye.app.domain.model.NotificationType
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class NotificationsViewModel @Inject constructor(
    @ApplicationContext private val context: Context
) : ViewModel() {

    private val _state = MutableStateFlow(NotificationsState())
    val state = _state.asStateFlow()

    init {
        loadNotifications()
    }

    private fun loadNotifications() {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.getNotificationApi(context).getNotifications()
                if (response.isSuccessful && response.body() != null) {
                    val apiNotifications = response.body()!!
                    
                    val allNotifications = apiNotifications.map { apiNotif ->
                        Notification(
                            id = apiNotif.id,
                            title = apiNotif.title,
                            description = apiNotif.message,
                            timeAgo = apiNotif.created_at, // Ideally format this
                            type = if (apiNotif.title.contains("Complaint", true)) NotificationType.STATUS_UPDATE else NotificationType.ANNOUNCEMENT,
                            isRead = apiNotif.is_read
                        )
                    }
                    
                    val unread = allNotifications.filter { !it.isRead }
                    val read = allNotifications.filter { it.isRead }
                    
                    _state.update { it.copy(unreadNotifications = unread, readNotifications = read) }
                }
            } catch (e: Exception) {
                // Ignore error for now, will keep mock or empty
            }
        }
    }

    fun onTabSelected(isUnread: Boolean) {
        _state.update { it.copy(isUnreadTabSelected = isUnread) }
    }
}
