package com.publiceye.app.presentation.updates

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.publiceye.app.R
import com.publiceye.app.presentation.home.HomeBottomNavigation

@Composable
fun CommunityUpdatesScreen(
    onNavigateBack: () -> Unit,
    onNavigateTo: (String) -> Unit
) {
    Scaffold(
        bottomBar = {
            HomeBottomNavigation(currentRoute = "home", onNavigate = onNavigateTo)
        },
        containerColor = Color(0xFFF5F5F5) // Off-white/Light grey background
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(bottom = 16.dp)
        ) {
            // TOP APP BAR (White Background)
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White)
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 20.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(onClick = onNavigateBack) {
                            Icon(
                                painter = painterResource(id = R.drawable.ic_back),
                                contentDescription = "Back",
                                tint = Color.Black
                            )
                        }
                        Column(modifier = Modifier.padding(start = 8.dp)) {
                            Text(
                                text = "Community Updates",
                                color = Color.Black,
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Latest from your area",
                                color = Color.Gray,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            }

            // STATS ROW
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    StatCard(value = "2,847", label = "Active Citizens", color = Color.Black, modifier = Modifier.weight(1f))
                    StatCard(value = "1,234", label = "Issues Resolved", color = Color(0xFF22C55E), modifier = Modifier.weight(1f))
                    StatCard(value = "156", label = "This Month", color = Color(0xFFF97316), modifier = Modifier.weight(1f))
                }
            }

            // COMMUNITY IMPACT BANNER
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF22C55E))
                ) {
                    Row(
                        modifier = Modifier.padding(20.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_users),
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(36.dp)
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Column {
                            Text(
                                text = "Community Impact",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp
                            )
                            Text(
                                text = "Together, we've made 1,234 positive changes in our city this year. Every report counts!",
                                color = Color.White.copy(alpha = 0.9f),
                                fontSize = 13.sp,
                                lineHeight = 18.sp
                            )
                        }
                    }
                }
            }

            // RECENT UPDATES SECTION HEADER
            item {
                Text(
                    text = "Recent Updates",
                    modifier = Modifier.padding(start = 16.dp, top = 24.dp, bottom = 12.dp),
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
            }

            // RECENT UPDATES ITEMS
            items(recentUpdates) { update ->
                UpdateCard(update)
            }
        }
    }
}

@Composable
fun StatCard(value: String, label: String, color: Color, modifier: Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = value, color = color, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Text(text = label, color = Color.Gray, fontSize = 10.sp, textAlign = androidx.compose.ui.text.style.TextAlign.Center)
        }
    }
}

data class CommunityUpdate(
    val title: String,
    val description: String,
    val tag: String,
    val time: String,
    val resolvedCount: String
)

val recentUpdates = listOf(
    CommunityUpdate(
        "Street Lighting Improved in Downtown",
        "Thanks to 47 community reports, new LED streetlights have been installed across the downtown area.",
        "Infrastructure",
        "2 days ago",
        "47 reports resolved"
    ),
    CommunityUpdate(
        "New Waste Collection Schedule",
        "Starting next Monday, waste collection will occur twice daily in residential zones.",
        "Sanitation",
        "3 days ago",
        "12 zones updated"
    )
)

@Composable
fun UpdateCard(update: CommunityUpdate) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.Top) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFF00B7A8)), // Teal rounded square
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_check_circle),
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(24.dp)
                )
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = update.title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = Color.Black
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = update.description,
                    color = Color.Gray,
                    fontSize = 13.sp,
                    lineHeight = 18.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = update.tag, color = Color.Gray, fontSize = 11.sp)
                    Text(text = " • ", color = Color.Gray, fontSize = 11.sp)
                    Text(text = update.time, color = Color.Gray, fontSize = 11.sp)
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = update.resolvedCount,
                    color = Color(0xFF00B7A8),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.clickable { /* Link */ }
                )
            }
        }
    }
}
