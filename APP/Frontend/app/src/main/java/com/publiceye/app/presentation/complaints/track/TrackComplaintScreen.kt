package com.publiceye.app.presentation.complaints.track

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.publiceye.app.R
import com.publiceye.app.presentation.home.HomeBottomNavigation

@Composable
fun TrackComplaintScreen(
    onNavigateBack: () -> Unit,
    onNavigateTo: (String) -> Unit,
    viewModel: TrackComplaintViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        bottomBar = {
            HomeBottomNavigation(currentRoute = "home", onNavigate = onNavigateTo)
        },
        containerColor = Color(0xFFF5F5F5) // Light grey background
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top App Bar Area
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF00B7A8)) // Teal background
                        .statusBarsPadding()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        IconButton(onClick = onNavigateBack) {
                            Icon(
                                painter = painterResource(id = R.drawable.ic_back),
                                contentDescription = "Back",
                                tint = Color.White
                            )
                        }
                        
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "Track Complaint",
                                color = Color.White,
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Real-time updates",
                                color = Color.White.copy(alpha = 0.9f),
                                fontSize = 13.sp
                            )
                        }

                        IconButton(onClick = { viewModel.refresh() }) {
                            Icon(
                                painter = painterResource(id = R.drawable.ic_refresh),
                                contentDescription = "Refresh",
                                tint = Color.White
                            )
                        }
                    }
                    
                    // Auto-refresh label
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFF009688))
                            .padding(vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Auto-refresh enabled",
                            color = Color.White,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            // Live Updates Card
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(24.dp)) {
                        // Section Header
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(10.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFFFF5252)) // Red/Orange dot
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "Live Updates",
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = Color(0xFF1E293B)
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(24.dp))
                        
                        if (state.updates.isEmpty()) {
                            Text(
                                text = "No recent updates available.",
                                color = Color(0xFF64748B),
                                fontSize = 14.sp
                            )
                        } else {
                            state.updates.forEachIndexed { index, update ->
                                UpdateItem(update)
                                if (index < state.updates.size - 1) {
                                    HorizontalDivider(
                                        modifier = Modifier.padding(vertical = 16.dp),
                                        color = Color(0xFFF1F5F9)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Empty State Section
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 48.dp, horizontal = 24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_file_text),
                        contentDescription = null,
                        modifier = Modifier.size(100.dp),
                        tint = Color(0xFFCBD5E1)
                    )
                    Spacer(modifier = Modifier.height(20.dp))
                    Text(
                        text = "No Active Complaints",
                        fontWeight = FontWeight.Bold,
                        fontSize = 22.sp,
                        color = Color(0xFF1E293B)
                    )
                    Text(
                        text = "You don't have any complaints to track",
                        color = Color(0xFF64748B),
                        fontSize = 15.sp,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(32.dp))
                    Button(
                        onClick = { onNavigateTo("report_issue") },
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00B7A8)),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(54.dp)
                    ) {
                        Text(
                            text = "Report an Issue",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
            
            // Padding for bottom
            item {
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
}

@Composable
private fun UpdateItem(update: TrackUpdate) {
    Row(verticalAlignment = Alignment.Top) {
        Icon(
            painter = painterResource(id = R.drawable.ic_clock),
            contentDescription = null,
            modifier = Modifier.size(20.dp),
            tint = Color(0xFF64748B)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column {
            Text(
                text = update.title,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = Color(0xFF334155)
            )
            Text(
                text = update.timestamp,
                color = Color(0xFF94A3B8),
                fontSize = 13.sp
            )
        }
    }
}
