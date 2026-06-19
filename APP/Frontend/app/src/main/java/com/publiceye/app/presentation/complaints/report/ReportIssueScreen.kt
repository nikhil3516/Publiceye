package com.publiceye.app.presentation.complaints.report

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
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
fun ReportIssueScreen(
    onNavigateBack: () -> Unit,
    onCategorySelected: (String) -> Unit,
    onNavigateTo: (String) -> Unit
) {
    val issueList = listOf(
        IssueModel("Dirty Spot", R.drawable.ic_dirty_spot),
        IssueModel("Garbage Dump", R.drawable.ic_garbage),
        IssueModel("Garbage Vehicle Not Arrived", R.drawable.ic_vehicle),
        IssueModel("Burning Garbage", R.drawable.ic_fire),
        IssueModel("Sweeping Not Done", R.drawable.ic_broom),
        IssueModel("Dustbins Not Cleaned", R.drawable.ic_dustbin),
        IssueModel("Open Defecation", R.drawable.ic_warning),
        IssueModel("Sewerage Overflow", R.drawable.ic_water),
        IssueModel("Blocked Public Toilet", R.drawable.ic_toilet),
        IssueModel("Unclean Public Toilet", R.drawable.ic_toilet),
        IssueModel("Public Urination Spot", R.drawable.ic_warning),
        IssueModel("Improper Waste Disposal", R.drawable.ic_recycle),
        IssueModel("Open Manholes", R.drawable.ic_manhole),
        IssueModel("Unsafe Manhole", R.drawable.ic_warning),
        IssueModel("Construction Debris", R.drawable.ic_construction),
        IssueModel("Dead Animals", R.drawable.ic_dead)
    )

    Scaffold(
        bottomBar = {
            HomeBottomNavigation(currentRoute = "report", onNavigate = onNavigateTo)
        },
        containerColor = Color.White
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Header with Gradient
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
                    .background(
                        androidx.compose.ui.graphics.Brush.verticalGradient(
                            listOf(Color(0xFF00BFA5), Color(0xFF00897B))
                        )
                    )
                    .statusBarsPadding()
            ) {
                Column(Modifier.padding(16.dp)) {
                    Surface(
                        onClick = onNavigateBack,
                        shape = CircleShape,
                        color = Color.White.copy(alpha = 0.2f),
                        modifier = Modifier.size(36.dp)
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

                    Text(
                        text = "Report an Issue",
                        color = Color.White,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(top = 12.dp)
                    )
                    Text(
                        text = "Choose a category below",
                        color = Color.White.copy(alpha = 0.8f),
                        fontSize = 14.sp
                    )
                }
            }

            // LIST
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 16.dp)
            ) {
                items(issueList) { item ->
                    IssueItemRow(item) {
                        onCategorySelected(item.title)
                    }
                    HorizontalDivider(
                        modifier = Modifier.padding(horizontal = 16.dp),
                        thickness = 0.5.dp,
                        color = Color(0xFFEEEEEE)
                    )
                }
            }
        }
    }
}

data class IssueModel(val title: String, val icon: Int)

@Composable
fun IssueItemRow(item: IssueModel, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            shape = RoundedCornerShape(12.dp),
            color = Color(0xFFF1F5F9),
            modifier = Modifier.size(48.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    painter = painterResource(id = item.icon),
                    contentDescription = null,
                    tint = Color.Unspecified,
                    modifier = Modifier.size(28.dp)
                )
            }
        }

        Text(
            text = item.title,
            color = Color(0xFF1E293B),
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium,
            modifier = Modifier
                .weight(1f)
                .padding(start = 16.dp)
        )

        Icon(
            painter = painterResource(id = R.drawable.ic_arrow_right),
            contentDescription = null,
            tint = Color(0xFF94A3B8),
            modifier = Modifier.size(16.dp)
        )
    }
}
