package com.publiceye.app.presentation.profile

import android.Manifest
import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import coil.compose.AsyncImage
import com.publiceye.app.R
import com.publiceye.app.data.model.MockData
import com.publiceye.app.presentation.home.HomeBottomNavigation
import com.publiceye.app.presentation.navigation.Screen
import com.publiceye.app.util.LocalTranslation
import java.io.File

@Composable
fun ProfileScreen(
    onNavigateTo: (String) -> Unit,
    viewModel: ProfileViewModel = hiltViewModel()
) {
    val context = LocalContext.current
    val t = LocalTranslation.current
    val lifecycleOwner = LocalLifecycleOwner.current
    
    val userName by viewModel.userName
    val userWard by viewModel.userWard
    val profileImageUri by viewModel.profileImageUri
    
    var showPhotoOptions by remember { mutableStateOf(false) }
    var showWhatsNewDialog by remember { mutableStateOf(false) }

    // Refresh data when screen resumes
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) {
                viewModel.refreshData()
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }

    // Launcher for Gallery
    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let { viewModel.updateProfileImage(it.toString()) }
    }

    // Launcher for Camera
    var tempPhotoUri by remember { mutableStateOf<Uri?>(null) }
    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicture()
    ) { success ->
        if (success && tempPhotoUri != null) {
            viewModel.updateProfileImage(tempPhotoUri.toString())
        }
    }

    // Permission Launchers
    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val cameraGranted = permissions[Manifest.permission.CAMERA] ?: false
        if (cameraGranted) {
            val photoFile = File(context.filesDir, "profile_${System.currentTimeMillis()}.jpg")
            val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", photoFile)
            tempPhotoUri = uri
            cameraLauncher.launch(uri)
        } else {
            Toast.makeText(context, context.getString(R.string.camera_denied), Toast.LENGTH_SHORT).show()
        }
    }

    if (showWhatsNewDialog) {
        AlertDialog(
            onDismissRequest = { showWhatsNewDialog = false },
            title = { Text(stringResource(R.string.whats_new), fontWeight = FontWeight.Bold) },
            text = { Text(stringResource(R.string.whats_new_content)) },
            confirmButton = {
                TextButton(onClick = { showWhatsNewDialog = false }) {
                    Text(stringResource(R.string.close), color = Color(0xFF009688))
                }
            },
            shape = RoundedCornerShape(16.dp),
            containerColor = Color.White
        )
    }

    Scaffold(
        bottomBar = {
            HomeBottomNavigation(currentRoute = "profile", onNavigate = onNavigateTo)
        },
        containerColor = Color.White
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
        ) {
            // Language Indicator
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 16.dp),
                contentAlignment = Alignment.CenterEnd
            ) {
                Surface(
                    onClick = { onNavigateTo(Screen.ChangeLanguage.route) },
                    shape = CircleShape,
                    color = Color(0xFF14B8A6),
                    shadowElevation = 2.dp
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_navigation),
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = t.currentLanguage.label,
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // Top Section
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Profile Picture with Badge
                Box(contentAlignment = Alignment.BottomEnd) {
                    Surface(
                        shape = CircleShape,
                        color = Color(0xFFE2E8F0),
                        modifier = Modifier.size(112.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            if (profileImageUri != null) {
                                AsyncImage(
                                    model = profileImageUri,
                                    contentDescription = "Profile Picture",
                                    modifier = Modifier.fillMaxSize().clip(CircleShape),
                                    contentScale = ContentScale.Crop
                                )
                            } else {
                                Icon(
                                    painter = painterResource(id = R.drawable.ic_user),
                                    contentDescription = null,
                                    tint = Color(0xFF94A3B8),
                                    modifier = Modifier.size(56.dp)
                                )
                            }
                        }
                    }

                    // Camera button with + badge
                    Box(contentAlignment = Alignment.TopEnd) {
                        Surface(
                            onClick = { showPhotoOptions = true },
                            shape = CircleShape,
                            color = Color(0xFF1E3A8A),
                            shadowElevation = 4.dp,
                            modifier = Modifier.size(36.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    painter = painterResource(id = R.drawable.ic_camera),
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                        Surface(
                            shape = CircleShape,
                            color = Color.White,
                            modifier = Modifier.size(12.dp).offset(x = 2.dp, y = (-2).dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text("+", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1E3A8A))
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = userName,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0F172A)
                )
                Text(
                    text = "${stringResource(R.string.active_citizen)} • $userWard",
                    fontSize = 14.sp,
                    color = Color(0xFF64748B)
                )

                Spacer(modifier = Modifier.height(24.dp))

                // User Stats Card
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFFF8FAFC), RoundedCornerShape(16.dp))
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    UserStatItem(stringResource(R.string.nav_complaints), MockData.userStats["totalComplaints"].toString())
                    Box(modifier = Modifier.width(1.dp).height(40.dp).background(Color(0xFFE2E8F0)))
                    UserStatItem(stringResource(R.string.status_resolved), MockData.userStats["resolved"].toString())
                    Box(modifier = Modifier.width(1.dp).height(40.dp).background(Color(0xFFE2E8F0)))
                    UserStatItem("Points", MockData.userStats["points"].toString())
                }

                Spacer(modifier = Modifier.height(32.dp))

                // Menu Items
                val menuItems = listOf(
                    ProfileMenuItem(R.drawable.ic_user, stringResource(R.string.edit_profile), "EDIT_PROFILE"),
                    ProfileMenuItem(R.drawable.ic_bell, t.t("profile.checkNotifications"), Screen.Notifications.route),
                    ProfileMenuItem(R.drawable.ic_navigation, t.t("profile.changeLanguage"), Screen.ChangeLanguage.route),
                    ProfileMenuItem(R.drawable.ic_star, t.t("profile.ratePlaystore"), "RATE"),
                    ProfileMenuItem(R.drawable.ic_warning, t.t("profile.reportIssue"), Screen.ReportIssue.route),
                    ProfileMenuItem(R.drawable.ic_lock, t.t("profile.privacyPolicy"), "PRIVACY"),
                    ProfileMenuItem(R.drawable.ic_info, t.t("profile.whatsNew"), "WHATS_NEW")
                )

                Column(modifier = Modifier.fillMaxWidth()) {
                    menuItems.forEach { item ->
                        ProfileMenuRow(item) {
                            when (item.link) {
                                "EDIT_PROFILE" -> {
                                    val intent = Intent(context, EditProfileActivity::class.java)
                                    context.startActivity(intent)
                                }
                                "RATE" -> {
                                    val packageName = context.packageName
                                    val uri = Uri.parse("market://details?id=$packageName")
                                    val intent = Intent(Intent.ACTION_VIEW, uri)
                                    intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY or
                                            Intent.FLAG_ACTIVITY_NEW_DOCUMENT or
                                            Intent.FLAG_ACTIVITY_MULTIPLE_TASK)
                                    try {
                                        context.startActivity(intent)
                                    } catch (e: ActivityNotFoundException) {
                                        context.startActivity(Intent(Intent.ACTION_VIEW,
                                            Uri.parse("https://play.google.com/store/apps/details?id=$packageName")))
                                    }
                                }
                                "PRIVACY" -> {
                                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://publiceyeapp.gov.in/privacy"))
                                    context.startActivity(intent)
                                }
                                "WHATS_NEW" -> {
                                    showWhatsNewDialog = true
                                }
                                else -> {
                                    if (item.link != "#") {
                                        onNavigateTo(item.link)
                                    }
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(32.dp))

                // Logout Button
                Surface(
                    onClick = { onNavigateTo(Screen.Login.route) },
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFFF1F5F9),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxSize(),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_close),
                            contentDescription = null,
                            tint = Color(0xFFEF4444),
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = stringResource(R.string.log_out),
                            color = Color(0xFFEF4444),
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }

    if (showPhotoOptions) {
        AlertDialog(
            onDismissRequest = { showPhotoOptions = false },
            title = { Text(stringResource(R.string.profile_photo), fontWeight = FontWeight.Bold) },
            text = { Text(stringResource(R.string.choose_photo_option)) },
            confirmButton = {
                TextButton(onClick = { showPhotoOptions = false }) {
                    Text(stringResource(R.string.cancel))
                }
            },
            dismissButton = {
                Column {
                    TextButton(onClick = {
                        showPhotoOptions = false
                        val permissions = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                            arrayOf(Manifest.permission.CAMERA, Manifest.permission.READ_MEDIA_IMAGES)
                        } else {
                            arrayOf(Manifest.permission.CAMERA, Manifest.permission.READ_EXTERNAL_STORAGE)
                        }
                        permissionLauncher.launch(permissions)
                    }) {
                        Text(stringResource(R.string.take_photo), color = Color(0xFF009688))
                    }
                    TextButton(onClick = {
                        showPhotoOptions = false
                        galleryLauncher.launch("image/*")
                    }) {
                        Text(stringResource(R.string.upload_image), color = Color(0xFF009688))
                    }
                }
            },
            shape = RoundedCornerShape(16.dp),
            containerColor = Color.White
        )
    }
}

@Composable
fun UserStatItem(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF14B8A6)
        )
        Text(
            text = label,
            fontSize = 12.sp,
            color = Color(0xFF64748B)
        )
    }
}

data class ProfileMenuItem(val iconRes: Int, val label: String, val link: String)

@Composable
fun ProfileMenuRow(item: ProfileMenuItem, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            shape = CircleShape,
            color = Color(0xFFF1F5F9),
            modifier = Modifier.size(40.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    painter = painterResource(id = item.iconRes),
                    contentDescription = null,
                    tint = Color(0xFF64748B),
                    modifier = Modifier.size(20.dp)
                )
            }
        }
        Text(
            text = item.label,
            color = Color(0xFF334155),
            fontWeight = FontWeight.Medium,
            fontSize = 16.sp,
            modifier = Modifier
                .weight(1f)
                .padding(start = 16.dp)
        )
        Icon(
            painter = painterResource(id = R.drawable.ic_arrow_right),
            contentDescription = null,
            tint = Color(0xFFCBD5E1),
            modifier = Modifier.size(16.dp)
        )
    }
}
