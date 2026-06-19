package com.publiceye.app.presentation.notifications

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.publiceye.app.R
import com.publiceye.app.domain.model.Notification
import com.publiceye.app.domain.model.NotificationType
import com.publiceye.app.presentation.home.HomeBottomNavigation

@Composable
fun NotificationsScreen(
    onNavigateTo: (String) -> Unit,
    viewModel: NotificationsViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        bottomBar = {
            HomeBottomNavigation(currentRoute = "notifications", onNavigate = onNavigateTo)
        },
        containerColor = Color(0xFFF8FAFC)
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Header
            Text(
                text = stringResource(R.string.notifications_title),
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0F172A),
                modifier = Modifier.padding(24.dp)
            )

            // Tab Switcher
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp)
                    .height(48.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFF1F5F9))
            ) {
                TabItem(
                    label = stringResource(R.string.unread),
                    count = state.unreadNotifications.size,
                    isSelected = state.isUnreadTabSelected,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.onTabSelected(true) }
                )
                TabItem(
                    label = stringResource(R.string.previously_read),
                    isSelected = !state.isUnreadTabSelected,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.onTabSelected(false) }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Notifications List
            val currentNotifications = if (state.isUnreadTabSelected) {
                state.unreadNotifications
            } else {
                state.readNotifications
            }

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 24.dp)
            ) {
                items(currentNotifications) { notification ->
                    NotificationCard(notification)
                }
            }
        }
    }
}

@Composable
fun TabItem(
    label: String,
    count: Int? = null,
    isSelected: Boolean,
    modifier: Modifier,
    onClick: () -> Unit
) {
    Surface(
        modifier = modifier
            .fillMaxHeight()
            .clickable(onClick = onClick),
        color = if (isSelected) Color(0xFF14B8A6) else Color.Transparent,
        shape = RoundedCornerShape(10.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Text(
                text = label,
                color = if (isSelected) Color.White else Color(0xFF64748B),
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
            if (count != null && count > 0) {
                Spacer(modifier = Modifier.width(8.dp))
                Surface(
                    shape = CircleShape,
                    color = if (isSelected) Color.White.copy(alpha = 0.2f) else Color(0xFFCBD5E1),
                    modifier = Modifier.size(24.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(
                            text = count.toString(),
                            color = if (isSelected) Color.White else Color(0xFF64748B),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun NotificationCard(notification: Notification) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 8.dp),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.Top
        ) {
            // Icon
            val (icon, tint) = when (notification.type) {
                NotificationType.ACKNOWLEDGEMENT -> R.drawable.ic_check_circle to Color(0xFF14B8A6)
                NotificationType.STATUS_UPDATE -> R.drawable.ic_info to Color(0xFFF97316)
                NotificationType.COMMUNITY_UPDATE -> R.drawable.ic_community to Color(0xFF14B8A6)
                NotificationType.RESOLUTION -> R.drawable.ic_check_circle to Color(0xFF22C55E)
                NotificationType.ANNOUNCEMENT -> R.drawable.ic_megaphone to Color(0xFF64748B)
            }

            Surface(
                shape = CircleShape,
                color = tint.copy(alpha = 0.1f),
                modifier = Modifier.size(40.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        painter = painterResource(id = icon),
                        contentDescription = null,
                        tint = tint,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.width(16.dp))

            // Content
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = notification.title,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1E293B),
                    fontSize = 17.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = notification.description,
                    color = Color(0xFF64748B),
                    fontSize = 13.sp,
                    lineHeight = 20.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = notification.timeAgo,
                    color = Color(0xFF94A3B8),
                    fontSize = 11.sp,
                    modifier = Modifier.align(Alignment.End)
                )
            }
        }
    }
}
