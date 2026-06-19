package com.publiceye.app.presentation.complaints

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.publiceye.app.R
import com.publiceye.app.data.local.entities.ComplaintEntity
import com.publiceye.app.presentation.complaints.track.ComplaintTrackingActivity
import com.publiceye.app.presentation.complaints.track.TrackViewModel
import com.publiceye.app.presentation.home.HomeBottomNavigation

@Composable
fun ComplaintSectionBase(
    title: String,
    headerColor: Color,
    onNavigateBack: () -> Unit,
    onNavigateTo: (String) -> Unit,
    content: @Composable BoxScope.() -> Unit
) {
    Scaffold(
        topBar = {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp)
                    .background(headerColor)
                    .statusBarsPadding(),
                contentAlignment = Alignment.CenterStart
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_back),
                            contentDescription = "Back",
                            tint = Color.White
                        )
                    }
                    Text(
                        text = title,
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        },
        bottomBar = {
            HomeBottomNavigation(currentRoute = "complaints", onNavigate = onNavigateTo)
        },
        containerColor = Color(0xFFF0F4F8)
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentAlignment = Alignment.Center,
            content = content
        )
    }
}

@Composable
fun EmptyStateView(
    icon: @Composable () -> Unit,
    title: String = "No Records Found - Yet.",
    subtitle: String? = null
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier.padding(32.dp)
    ) {
        icon()
        Spacer(modifier = Modifier.height(24.dp))
        Text(
            text = title,
            color = Color(0xFF64748B),
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )
        if (subtitle != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = subtitle,
                color = Color(0xFF94A3B8),
                fontSize = 14.sp,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
fun CircularIconPlaceholder(
    iconRes: Int,
    backgroundColor: Color,
    iconColor: Color,
    size: Int = 80
) {
    Box(
        modifier = Modifier
            .size(size.dp)
            .clip(CircleShape)
            .background(backgroundColor),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            painter = painterResource(id = iconRes),
            contentDescription = null,
            tint = iconColor,
            modifier = Modifier.size((size * 0.5).dp)
        )
    }
}

@Composable
fun PostedComplaintsScreen(
    onNavigateBack: () -> Unit,
    onNavigateTo: (String) -> Unit,
    viewModel: TrackViewModel = hiltViewModel()
) {
    val complaints by viewModel.allComplaints.collectAsState(initial = emptyList())
    val context = LocalContext.current

    ComplaintSectionBase(
        title = "Posted",
        headerColor = Color(0xFF009688),
        onNavigateBack = onNavigateBack,
        onNavigateTo = onNavigateTo
    ) {
        if (complaints.isEmpty()) {
            EmptyStateView(
                icon = {
                    Box(modifier = Modifier.size(80.dp)) {
                        Column(modifier = Modifier.fillMaxSize()) {
                            Row(modifier = Modifier.weight(1f)) {
                                Box(modifier = Modifier.weight(1f).padding(2.dp).clip(RoundedCornerShape(4.dp)).background(Color(0xFFFF9800)))
                                Box(modifier = Modifier.weight(1f).padding(2.dp).clip(RoundedCornerShape(4.dp)).background(Color(0xFFFF9800))) {
                                     Box(
                                         modifier = Modifier
                                             .size(14.dp)
                                             .align(Alignment.TopEnd)
                                             .offset(x = 4.dp, y = (-4).dp)
                                             .clip(CircleShape)
                                             .background(Color.Red),
                                         contentAlignment = Alignment.Center
                                     ) {
                                         Text("!", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                     }
                                }
                            }
                            Row(modifier = Modifier.weight(1f)) {
                                Box(modifier = Modifier.weight(1f).padding(2.dp).clip(RoundedCornerShape(4.dp)).background(Color(0xFFFF9800)))
                                Box(modifier = Modifier.weight(1f).padding(2.dp).clip(RoundedCornerShape(4.dp)).background(Color(0xFFFF9800)))
                            }
                        }
                    }
                }
            )
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(complaints) { complaint ->
                    ComplaintCard(complaint) {
                        val intent = Intent(context, ComplaintTrackingActivity::class.java).apply {
                            putExtra("COMPLAINT_ID", complaint.id)
                        }
                        context.startActivity(intent)
                    }
                }
            }
        }
    }
}

@Composable
fun ComplaintCard(complaint: ComplaintEntity, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(
                            when (complaint.slaStatus) {
                                "BREACHED" -> Color(0xFFF44336)
                                "AT_RISK" -> Color(0xFFFF9800)
                                else -> Color(0xFF4CAF50)
                            }
                        )
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = complaint.title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = Color(0xFF1E293B)
                )
                Spacer(modifier = Modifier.weight(1f))
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = when (complaint.status) {
                        "RESOLVED" -> Color(0xFFE8F5E9)
                        "IN_PROGRESS" -> Color(0xFFFFF3E0)
                        else -> Color(0xFFF1F5F9)
                    }
                ) {
                    Text(
                        text = complaint.status,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = when (complaint.status) {
                            "RESOLVED" -> Color(0xFF2E7D32)
                            "IN_PROGRESS" -> Color(0xFFEF6C00)
                            else -> Color(0xFF64748B)
                        }
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = complaint.description,
                maxLines = 2,
                fontSize = 14.sp,
                color = Color(0xFF64748B)
            )
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = onClick,
                modifier = Modifier.fillMaxWidth().height(40.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00B7A8))
            ) {
                Text("Track Complaint", fontSize = 13.sp)
            }
        }
    }
}

@Composable
fun VotedComplaintsScreen(onNavigateBack: () -> Unit, onNavigateTo: (String) -> Unit) {
    ComplaintSectionBase(
        title = "Voted Complaints",
        headerColor = Color(0xFF7B2FBE),
        onNavigateBack = onNavigateBack,
        onNavigateTo = onNavigateTo
    ) {
        EmptyStateView(
            icon = {
                CircularIconPlaceholder(
                    iconRes = R.drawable.ic_thumbs_up,
                    backgroundColor = Color(0xFFF3E5F5),
                    iconColor = Color(0xFF7B2FBE)
                )
            }
        )
    }
}

@Composable
fun NearbyComplaintsScreen(onNavigateBack: () -> Unit, onNavigateTo: (String) -> Unit) {
    ComplaintSectionBase(
        title = "Nearby Complaints",
        headerColor = Color(0xFF009688),
        onNavigateBack = onNavigateBack,
        onNavigateTo = onNavigateTo
    ) {
        EmptyStateView(
            icon = {
                CircularIconPlaceholder(
                    iconRes = R.drawable.ic_navigation,
                    backgroundColor = Color(0xFFE0F2F1),
                    iconColor = Color(0xFF009688)
                )
            }
        )
    }
}

@Composable
fun CityComplaintsScreen(onNavigateBack: () -> Unit, onNavigateTo: (String) -> Unit) {
    ComplaintSectionBase(
        title = "City Complaints",
        headerColor = Color(0xFF283593),
        onNavigateBack = onNavigateBack,
        onNavigateTo = onNavigateTo
    ) {
        EmptyStateView(
            icon = {
                CircularIconPlaceholder(
                    iconRes = R.drawable.ic_building,
                    backgroundColor = Color(0xFFE8EAF6),
                    iconColor = Color(0xFF283593)
                )
            }
        )
    }
}

@Composable
fun YourActivityScreen(onNavigateBack: () -> Unit, onNavigateTo: (String) -> Unit) {
    Scaffold(
        containerColor = Color(0xFFF1F5F9)
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFF97316))
                    .statusBarsPadding()
                    .padding(horizontal = 16.dp, vertical = 20.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        onClick = onNavigateBack,
                        shape = CircleShape,
                        color = Color.White.copy(alpha = 0.2f),
                        modifier = Modifier.size(40.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                painter = painterResource(id = R.drawable.ic_back),
                                contentDescription = "Back",
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Text(
                        text = "Your Activity",
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Surface(
                    shape = CircleShape,
                    color = Color(0xFFFFEDD5),
                    modifier = Modifier.size(96.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_user),
                            contentDescription = null,
                            tint = Color(0xFFEA580C),
                            modifier = Modifier.size(48.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(24.dp))
                Text(
                    text = "No Records Found - Yet.",
                    color = Color(0xFF475569),
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@Composable
fun SearchComplaintsScreen(onNavigateBack: () -> Unit, onNavigateTo: (String) -> Unit) {
    var searchQuery by remember { mutableStateOf("") }
    
    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF2E7D32))
                    .statusBarsPadding()
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_back),
                            contentDescription = "Back",
                            tint = Color.White
                        )
                    }
                    Text(
                        text = "Search Complaints",
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                        .height(50.dp),
                    shape = RoundedCornerShape(25.dp),
                    color = Color(0xFFF1F5F9)
                ) {
                    Row(
                        modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_search),
                            contentDescription = null,
                            tint = Color.Gray,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Box(contentAlignment = Alignment.CenterStart) {
                            if (searchQuery.isEmpty()) {
                                Text(
                                    "Search by location, category, or ID...",
                                    color = Color.Gray,
                                    fontSize = 14.sp
                                )
                            }
                            androidx.compose.foundation.text.BasicTextField(
                                value = searchQuery,
                                onValueChange = { searchQuery = it },
                                modifier = Modifier.fillMaxWidth(),
                                textStyle = androidx.compose.ui.text.TextStyle(fontSize = 14.sp)
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }
        },
        bottomBar = {
            HomeBottomNavigation(currentRoute = "complaints", onNavigate = onNavigateTo)
        },
        containerColor = Color(0xFFF0F4F8)
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentAlignment = Alignment.Center
        ) {
            EmptyStateView(
                icon = {
                    CircularIconPlaceholder(
                        iconRes = R.drawable.ic_search,
                        backgroundColor = Color(0xFFE8F5E9),
                        iconColor = Color(0xFF2E7D32)
                    )
                },
                title = "Search for complaints",
                subtitle = "Enter a location, category, or complaint ID"
            )
        }
    }
}
