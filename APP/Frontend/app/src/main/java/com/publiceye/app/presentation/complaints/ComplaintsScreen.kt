package com.publiceye.app.presentation.complaints

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.publiceye.app.R
import com.publiceye.app.presentation.home.HomeBottomNavigation
import com.publiceye.app.presentation.navigation.Screen

@Composable
fun ComplaintsScreen(
    onNavigateTo: (String) -> Unit
) {
    Scaffold(
        bottomBar = {
            HomeBottomNavigation(currentRoute = "complaints", onNavigate = onNavigateTo)
        },
        containerColor = Color(0xFFF0F4F8) // Light gray/blue background
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            Text(
                text = "Complaints",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1E293B),
                modifier = Modifier.padding(top = 32.dp, start = 24.dp, bottom = 16.dp)
            )

            val categories = listOf(
                ComplaintMenu(R.string.posted, R.drawable.ic_list, Color(0xFF009688), Screen.PostedComplaints.route),
                ComplaintMenu(R.string.voted, R.drawable.ic_thumbs_up, Color(0xFF7B2FBE), Screen.VotedComplaints.route),
                ComplaintMenu(R.string.nearby, R.drawable.ic_navigation, Color(0xFF00897B), Screen.NearbyComplaints.route),
                ComplaintMenu(R.string.city, R.drawable.ic_building, Color(0xFF283593), Screen.CityComplaints.route),
                ComplaintMenu(R.string.your_activity, R.drawable.ic_user, Color(0xFFFF6D00), Screen.YourActivity.route),
                ComplaintMenu(R.string.search, R.drawable.ic_search, Color(0xFF2E7D32), Screen.SearchComplaints.route)
            )

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(16.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(categories) { menu ->
                    ComplaintMenuCard(menu) {
                        onNavigateTo(menu.route)
                    }
                }
            }
        }
    }
}

data class ComplaintMenu(val titleRes: Int, val iconRes: Int, val color: Color, val route: String)

@Composable
fun ComplaintMenuCard(menu: ComplaintMenu, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .padding(8.dp)
            .height(140.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = menu.color),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Icon(
                painter = painterResource(id = menu.iconRes),
                contentDescription = null,
                tint = Color.White.copy(alpha = 0.9f),
                modifier = Modifier
                    .padding(16.dp)
                    .size(24.dp)
                    .align(Alignment.TopEnd)
            )
            Text(
                text = stringResource(id = menu.titleRes),
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                modifier = Modifier
                    .padding(16.dp)
                    .align(Alignment.BottomStart)
            )
        }
    }
}
