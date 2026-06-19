package com.publiceye.app.presentation.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.publiceye.app.R

@Composable
fun AdminDashboardScreen(
    onNavigateBack: () -> Unit
) {
    var activeTab by remember { mutableStateOf("complaints") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        // Simple Sidebar / Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF0F172A))
                .statusBarsPadding()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Admin Dashboard",
                color = Color.White,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.weight(1f)
            )
            IconButton(onClick = onNavigateBack) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_close),
                    contentDescription = "Logout",
                    tint = Color.White
                )
            }
        }

        // Tabs
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            TabItem("Complaints", activeTab == "complaints", Modifier.weight(1f)) { activeTab = "complaints" }
            TabItem("Overview", activeTab == "overview", Modifier.weight(1f)) { activeTab = "overview" }
        }

        // Content
        Box(modifier = Modifier.weight(1f).padding(horizontal = 16.dp)) {
            if (activeTab == "complaints") {
                ComplaintsTab()
            } else {
                OverviewTab()
            }
        }
    }
}

@Composable
fun TabItem(label: String, isSelected: Boolean, modifier: Modifier, onClick: () -> Unit) {
    Box(
        modifier = modifier
            .clickable(onClick = onClick)
            .background(
                if (isSelected) Color(0xFFEFF6FF) else Color.Transparent,
                RoundedCornerShape(8.dp)
            )
            .padding(vertical = 12.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            color = if (isSelected) Color(0xFF2563EB) else Color(0xFF64748B),
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
        )
    }
}

@Composable
fun ComplaintsTab() {
    val complaints = listOf(
        ComplaintData("Garbage Overflow", "High", 12, "2023-10-25"),
        ComplaintData("Pothole on Main Road", "Medium", 8, "2023-10-24"),
        ComplaintData("Streetlight Not Working", "Low", 5, "2023-10-23")
    )

    LazyColumn {
        items(complaints) { complaint ->
            Card(
                modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = complaint.title, fontWeight = FontWeight.Bold, color = Color(0xFF1E293B))
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "Severity: ${complaint.severity}", fontSize = 12.sp, color = Color(0xFF64748B))
                        Text(text = "Upvotes: ${complaint.upvotes}", fontSize = 12.sp, color = Color(0xFF64748B))
                        Text(text = complaint.date, fontSize = 12.sp, color = Color(0xFF64748B))
                    }
                }
            }
        }
    }
}

@Composable
fun OverviewTab() {
    Column {
        Text(text = "System Overview", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
        Spacer(modifier = Modifier.height(16.dp))
        
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            StatCard("Recent Activity", Modifier.weight(1f)) {
                ActivityItem("New user registered", "2 hours ago")
                ActivityItem("Complaint resolved", "5 hours ago")
                ActivityItem("New complaint", "8 hours ago")
            }
            StatCard("Top Categories", Modifier.weight(1f)) {
                CategoryItem("Garbage", "45%")
                CategoryItem("Pothole", "30%")
                CategoryItem("Streetlight", "15%")
            }
        }
    }
}

@Composable
fun StatCard(title: String, modifier: Modifier, content: @Composable ColumnScope.() -> Unit) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = title, fontWeight = FontWeight.Bold, color = Color(0xFF1E293B), modifier = Modifier.padding(bottom = 12.dp))
            content()
        }
    }
}

@Composable
fun ActivityItem(title: String, time: String) {
    Column(modifier = Modifier.padding(bottom = 8.dp)) {
        Text(text = title, fontSize = 13.sp, color = Color(0xFF475569))
        Text(text = time, fontSize = 11.sp, color = Color(0xFF94A3B8))
    }
}

@Composable
fun CategoryItem(name: String, percentage: String) {
    Row(modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(text = name, fontSize = 13.sp, color = Color(0xFF475569))
        Text(text = percentage, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF1E293B))
    }
}

data class ComplaintData(val title: String, val severity: String, val upvotes: Int, val date: String)
