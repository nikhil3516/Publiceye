package com.publiceye.app.presentation.home

import android.app.Activity
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.hilt.navigation.compose.hiltViewModel
import com.publiceye.app.R
import com.publiceye.app.presentation.components.BottomNavItem
import com.publiceye.app.presentation.navigation.Screen
import com.publiceye.app.util.LocaleHelper
import kotlinx.coroutines.delay

@Composable
fun HomeScreen(
    onNavigateTo: (String) -> Unit,
    viewModel: HomeViewModel = hiltViewModel()
) {
    var showLanguageDialog by remember { mutableStateOf(false) }
    val context = LocalContext.current

    if (showLanguageDialog) {
        LanguageSelectionDialog(
            onDismiss = { showLanguageDialog = false },
            onLanguageSelected = { langCode ->
                LocaleHelper.setLocale(context, langCode)
                (context as? Activity)?.recreate()
                showLanguageDialog = false
            }
        )
    }

    Scaffold(
        bottomBar = {
            HomeBottomNavigation(currentRoute = "home", onNavigate = onNavigateTo)
        },
        containerColor = Color(0xFFF8FAFC)
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(bottom = 16.dp)
        ) {
            item {
                HomeHeader(onLanguageClick = { showLanguageDialog = true })
            }

            item {
                ProverbCarousel()
            }

            item {
                SLASummaryCard()
            }

            item {
                WelcomeSection()
            }

            item {
                ActionGrid(onActionClick = onNavigateTo)
            }
        }
    }
}

@Composable
fun HomeHeader(onLanguageClick: () -> Unit) {
    val context = LocalContext.current
    val currentLang = LocaleHelper.getLanguage(context).uppercase()

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 20.dp, end = 20.dp, top = 16.dp, bottom = 8.dp),
        horizontalArrangement = Arrangement.End
    ) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = Color(0xFF009688),
            modifier = Modifier
                .height(30.dp)
                .clickable { onLanguageClick() }
        ) {
            Box(
                modifier = Modifier.padding(horizontal = 14.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Select Language ($currentLang)",
                    color = Color.White,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
fun LanguageSelectionDialog(
    onDismiss: () -> Unit,
    onLanguageSelected: (String) -> Unit
) {
    val languages = listOf(
        Pair("English", "en"),
        Pair("Telugu", "te"),
        Pair("Hindi", "hi"),
        Pair("Tamil", "ta"),
        Pair("Kannada", "kn"),
        Pair("Malayalam", "ml")
    )

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = Color.White,
            modifier = Modifier.fillMaxWidth().padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Choose Language",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF1E293B)
                )
                Spacer(modifier = Modifier.height(16.dp))
                languages.forEach { (name, code) ->
                    TextButton(
                        onClick = { onLanguageSelected(code) },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(text = name, fontSize = 18.sp, color = Color(0xFF009688))
                    }
                    Divider(color = Color(0xFFF1F5F9))
                }
                Spacer(modifier = Modifier.height(8.dp))
                TextButton(onClick = onDismiss) {
                    Text(text = "Cancel", color = Color.Gray)
                }
            }
        }
    }
}

@Composable
fun SLASummaryCard() {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 12.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text(
                text = "SLA Status Overview",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                color = Color(0xFF1E293B)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                StatusItem("On Track", "8", Color(0xFF4CAF50))
                StatusItem("At Risk", "3", Color(0xFFF97316))
                StatusItem("Breached", "1", Color(0xFFF44336))
            }
        }
    }
}

@Composable
private fun StatusItem(label: String, count: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            modifier = Modifier
                .size(10.dp)
                .clip(CircleShape)
                .background(color)
        )
        Text(
            text = count,
            fontWeight = FontWeight.Bold,
            fontSize = 18.sp,
            color = Color(0xFF1E293B),
            modifier = Modifier.padding(top = 4.dp)
        )
        Text(
            text = label,
            fontSize = 12.sp,
            color = Color(0xFF64748B)
        )
    }
}

@Composable
fun ProverbCarousel() {
    val banners = listOf(
        BannerData(
            R.string.banner_title_1,
            R.string.banner_sub_1,
            Brush.horizontalGradient(listOf(Color(0xFFFF6D00), Color(0xFFFFAB40)))
        ),
        BannerData(
            R.string.banner_title_2,
            R.string.banner_sub_2,
            Brush.horizontalGradient(listOf(Color(0xFF2E7D32), Color(0xFF66BB6A)))
        ),
        BannerData(
            R.string.banner_title_3,
            R.string.banner_sub_3,
            Brush.horizontalGradient(listOf(Color(0xFF00838F), Color(0xFF4DD0E1)))
        )
    )

    val pagerState = rememberPagerState(pageCount = { banners.size })

    LaunchedEffect(Unit) {
        while (true) {
            delay(5000)
            if (pagerState.pageCount > 0) {
                val nextPage = (pagerState.currentPage + 1) % pagerState.pageCount
                pagerState.animateScrollToPage(nextPage)
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp)
            .height(170.dp)
    ) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxSize()
                .clip(RoundedCornerShape(28.dp))
        ) { page ->
            val banner = banners[page]
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(banner.brush)
                    .padding(24.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Column {
                    Text(
                        text = stringResource(id = banner.titleRes),
                        color = Color.White,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.ExtraBold,
                        lineHeight = 36.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = stringResource(id = banner.subRes),
                        color = Color.White.copy(alpha = 0.9f),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }

        Row(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            repeat(banners.size) { index ->
                val isActive = pagerState.currentPage == index
                Box(
                    modifier = Modifier
                        .height(6.dp)
                        .width(if (isActive) 20.dp else 6.dp)
                        .clip(CircleShape)
                        .background(if (isActive) Color.White else Color.White.copy(alpha = 0.4f))
                )
            }
        }
    }
}

data class BannerData(val titleRes: Int, val subRes: Int, val brush: Brush)

data class ActionItem(
    val titleRes: Int,
    val subRes: Int,
    val iconRes: Int,
    val color: Color,
    val route: String,
    val isGradient: Boolean = false
)

@Composable
fun WelcomeSection() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 20.dp)
    ) {
        Text(
            text = "Good Afternoon, Welcome\nActive Citizen",
            style = MaterialTheme.typography.titleLarge.copy(
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                lineHeight = 28.sp
            ),
            color = Color(0xFF1E293B)
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = "Here are today's actions for you",
            style = MaterialTheme.typography.bodyMedium,
            color = Color(0xFF64748B)
        )
    }
}

@Composable
fun ActionGrid(onActionClick: (String) -> Unit) {
    val actions = listOf(
        ActionItem(R.string.report_issue, R.string.report_issue_sub, R.drawable.ic_alert_circle, Color(0xFF14B8A6), Screen.ReportIssue.route),
        ActionItem(R.string.citizen_feedback, R.string.citizen_feedback_sub, R.drawable.ic_feedback, Color(0xFFF97316), Screen.Survey.route),
        ActionItem(R.string.find_facilities, R.string.find_facilities_sub, R.drawable.ic_map_pin, Color(0xFF22C55E), Screen.FindFacilities.route),
        ActionItem(R.string.rate_services, R.string.rate_services_sub, R.drawable.ic_star, Color(0xFF06B6D4), Screen.RateServices.route),
        ActionItem(R.string.track_complaint, R.string.track_complaint_sub, R.drawable.ic_file_text, Color(0xFFF97316), Screen.TrackComplaint.route, isGradient = true),
        ActionItem(R.string.community_updates, R.string.community_updates_sub, R.drawable.ic_users, Color(0xFF10B981), Screen.CommunityUpdates.route)
    )

    Column(
        modifier = Modifier
            .padding(horizontal = 14.dp)
            .fillMaxWidth()
    ) {
        for (i in actions.indices step 2) {
            Row(modifier = Modifier.fillMaxWidth()) {
                ActionCard(actions[i], modifier = Modifier.weight(1f), onClick = onActionClick)
                if (i + 1 < actions.size) {
                    ActionCard(actions[i + 1], modifier = Modifier.weight(1f), onClick = onActionClick)
                }
            }
        }
    }
}

@Composable
fun ActionCard(item: ActionItem, modifier: Modifier, onClick: (String) -> Unit) {
    Card(
        modifier = modifier
            .padding(6.dp)
            .height(150.dp)
            .clickable { onClick(item.route) },
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        val backgroundModifier = if (item.isGradient) {
            Modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(listOf(Color(0xFFF97316), Color(0xFFEC4899))))
        } else {
            Modifier
                .fillMaxSize()
                .background(item.color)
        }

        Column(
            modifier = backgroundModifier.padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Surface(
                shape = CircleShape,
                color = Color.White.copy(alpha = 0.15f),
                modifier = Modifier.size(36.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        painter = painterResource(id = item.iconRes),
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Column {
                Text(
                    text = stringResource(id = item.titleRes),
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    lineHeight = 20.sp
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = stringResource(id = item.subRes),
                    color = Color.White.copy(alpha = 0.8f),
                    fontSize = 11.sp
                )
            }
        }
    }
}

@Composable
fun HomeBottomNavigation(currentRoute: String, onNavigate: (String) -> Unit) {
    Box(
        modifier = Modifier.fillMaxWidth(),
        contentAlignment = Alignment.BottomCenter
    ) {
        Surface(
            color = Color.White,
            tonalElevation = 8.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .navigationBarsPadding()
                    .height(80.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BottomNavItemView(BottomNavItem.Home, currentRoute == "home", Modifier.weight(1f), onNavigate)
                BottomNavItemView(BottomNavItem.Notifications, currentRoute == "notifications", Modifier.weight(1f), onNavigate)
                
                Spacer(modifier = Modifier.weight(1.2f))

                BottomNavItemView(BottomNavItem.Complaints, currentRoute == "complaints", Modifier.weight(1f), onNavigate)
                BottomNavItemView(BottomNavItem.Profile, currentRoute == "profile", Modifier.weight(1f), onNavigate)
            }
        }

        FloatingActionButton(
            onClick = { onNavigate(Screen.ReportIssue.route) },
            shape = CircleShape,
            containerColor = Color(0xFF14B8A6),
            contentColor = Color.White,
            modifier = Modifier
                .padding(bottom = 50.dp)
                .size(64.dp),
            elevation = FloatingActionButtonDefaults.elevation(defaultElevation = 10.dp)
        ) {
            Icon(
                painter = painterResource(id = R.drawable.ic_plus),
                contentDescription = "Add",
                modifier = Modifier.size(32.dp)
            )
        }
    }
}

@Composable
fun BottomNavItemView(item: BottomNavItem, isSelected: Boolean, modifier: Modifier, onNavigate: (String) -> Unit) {
    val color = if (isSelected) Color(0xFF009688) else Color(0xFF64748B)
    Column(
        modifier = modifier
            .fillMaxHeight()
            .clickable { onNavigate(item.route) },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            painter = painterResource(id = item.iconRes),
            contentDescription = null,
            tint = color,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = stringResource(id = item.titleRes),
            color = color,
            fontSize = 10.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
        )
    }
}
