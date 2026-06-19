package com.publiceye.app.presentation.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.publiceye.app.R
import com.publiceye.app.util.LocalTranslation
import com.publiceye.app.util.LanguageCode

@Composable
fun ChangeLanguageScreen(
    onNavigateBack: () -> Unit
) {
    val t = LocalTranslation.current
    val languages = LanguageCode.values()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        // Top Section - PublicEye Branding
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 48.dp, bottom = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
                modifier = Modifier.padding(bottom = 12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .background(
                            Brush.linearGradient(listOf(Color(0xFF14B8A6), Color(0xFF0D9488))),
                            CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_eye),
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(32.dp)
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(
                        text = "PublicEye",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0F766E)
                    )
                    Text(
                        text = "सार्वजनिक नज़र",
                        fontSize = 14.sp,
                        color = Color(0xFF475569)
                    )
                }
            }
            Text(
                text = "आपकी आवाज़, आपका शहर",
                fontSize = 14.sp,
                color = Color(0xFF334155)
            )
            Text(
                text = "Your Voice, Your City",
                fontSize = 12.sp,
                color = Color(0xFF475569)
            )
        }

        // Language Selection Card
        Box(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 24.dp)
                .fillMaxWidth(),
            contentAlignment = Alignment.Center
        ) {
            Card(
                shape = RoundedCornerShape(32.dp),
                colors = CardDefaults.cardColors(containerColor = Color.Transparent),
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .background(Brush.linearGradient(listOf(Color(0xFF14B8A6), Color(0xFFA3E635))))
                        .padding(24.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = t.t("language.select"),
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Surface(
                                onClick = onNavigateBack,
                                shape = CircleShape,
                                color = Color.White.copy(alpha = 0.3f),
                                modifier = Modifier.size(32.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        painter = painterResource(id = R.drawable.ic_close),
                                        contentDescription = "Close",
                                        tint = Color.White,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = Color.White,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column {
                                languages.forEachIndexed { index, lang ->
                                    LanguageRow(
                                        label = lang.label,
                                        isSelected = t.currentLanguage == lang,
                                        isLast = index == languages.size - 1
                                    ) {
                                        t.currentLanguage = lang
                                        // Optional: trigger a save to DataStore here
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Bottom Section - Government Branding
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .background(
                        Brush.linearGradient(listOf(Color(0xFFFB923C), Color.White, Color(0xFF4ADE80))),
                        CircleShape
                    )
                    .padding(2.dp),
                contentAlignment = Alignment.Center
            ) {
                Surface(
                    shape = CircleShape,
                    color = Color(0xFF1E3A8A),
                    modifier = Modifier.size(56.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(text = "🇮🇳", fontSize = 24.sp)
                    }
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = t.t("language.ministryHindi"),
                fontSize = 12.sp,
                color = Color(0xFF475569)
            )
            Text(
                text = t.t("language.ministryEnglish"),
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF334155)
            )
        }
    }
}

@Composable
fun LanguageRow(
    label: String,
    isSelected: Boolean,
    isLast: Boolean,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .background(if (isSelected) Color(0xFFF0FDFA) else Color.White)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp, horizontal = 24.dp),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = label,
                fontSize = 16.sp,
                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                color = if (isSelected) Color(0xFF0F766E) else Color(0xFF334155)
            )
            if (isSelected) {
                Spacer(modifier = Modifier.width(8.dp))
                Icon(
                    painter = painterResource(id = R.drawable.ic_check_circle),
                    contentDescription = null,
                    tint = Color(0xFF0D9488),
                    modifier = Modifier.size(20.dp)
                )
            }
        }
        if (!isLast) {
            HorizontalDivider(
                modifier = Modifier.padding(horizontal = 24.dp),
                thickness = 0.5.dp,
                color = Color(0xFFE2E8F0)
            )
        }
    }
}
