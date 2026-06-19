package com.publiceye.app.presentation.complaints.report

import android.Manifest
import android.content.pm.PackageManager
import android.content.Intent
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.provider.MediaStore
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.model.LatLng
import com.publiceye.app.R
import com.publiceye.app.data.remote.api.RetrofitClient
import com.publiceye.app.presentation.home.HomeBottomNavigation
import com.publiceye.app.presentation.navigation.Screen
import java.util.UUID
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody

@Composable
fun SubmitComplaintScreen(
    category: String,
    backStackEntry: androidx.navigation.NavBackStackEntry? = null,
    onNavigateBack: () -> Unit,
    onNavigateTo: (String) -> Unit,
    analysisViewModel: ImageAnalysisViewModel = hiltViewModel(),
    submitViewModel: SubmitComplaintViewModel = hiltViewModel()
) {
    val context = LocalContext.current
    var description by remember { mutableStateOf("") }
    var area by remember { mutableStateOf("Locating...") }
    val scrollState = rememberScrollState()
    val coroutineScope = rememberCoroutineScope()

    var selectedLatLng by remember { mutableStateOf(LatLng(13.0827, 80.2707)) }
    
    val severityResult by analysisViewModel.severityResult.collectAsState()
    val submissionState by submitViewModel.submissionState.collectAsState()

    // Handle Success
    LaunchedEffect(submissionState) {
        if (submissionState is SubmissionState.Success) {
            onNavigateBack()
        }
    }

    // Automatically fetch live location on launch
    LaunchedEffect(Unit) {
        val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
        try {
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                fusedLocationClient.lastLocation.addOnSuccessListener { location ->
                    if (location != null) {
                        selectedLatLng = LatLng(location.latitude, location.longitude)
                        area = "Current GPS Location"
                        Toast.makeText(context, "Live location updated", Toast.LENGTH_SHORT).show()
                    } else {
                        area = "Main Street, Ward 12, Chennai"
                    }
                }
            } else {
                area = "Main Street, Ward 12, Chennai"
            }
        } catch (e: Exception) {
            area = "Main Street, Ward 12, Chennai"
        }
    }

    // Listen for shared location from MainActivity
    LaunchedEffect(backStackEntry?.savedStateHandle) {
        backStackEntry?.savedStateHandle?.getLiveData<String>("shared_lat")?.observeForever { lat ->
            val lng = backStackEntry.savedStateHandle.get<String>("shared_lng")
            if (lat != null && lng != null) {
                selectedLatLng = LatLng(lat.toDouble(), lng.toDouble())
                area = "Location picked from Google Maps"
                Toast.makeText(context, "Location updated from Google Maps", Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    var selectedImageUri by remember { mutableStateOf<Uri?>(null) }
    var isUploading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val imagePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        selectedImageUri = uri
        uri?.let {
            try {
                val bitmap = if (Build.VERSION.SDK_INT < 28) {
                    MediaStore.Images.Media.getBitmap(context.contentResolver, it)
                } else {
                    val source = ImageDecoder.createSource(context.contentResolver, it)
                    ImageDecoder.decodeBitmap(source)
                }
                analysisViewModel.analyzeImage(bitmap)
            } catch (e: Exception) {
                Toast.makeText(context, "Error processing image", Toast.LENGTH_SHORT).show()
            }
        }
    }

    val isSubmitEnabled = description.trim().isNotEmpty() && selectedImageUri != null && !isUploading && !severityResult.isLoading

    fun onSubmitClick() {
        if (!isSubmitEnabled) return
        isUploading = true
        errorMessage = null

        val id = UUID.randomUUID().toString()
        submitViewModel.submitComplaint(
            id = id,
            title = category,
            description = description,
            imageUri = selectedImageUri,
            severity = severityResult.level.name,
            address = area
        )
        
        coroutineScope.launch {
            try {
                val inputStream = context.contentResolver.openInputStream(selectedImageUri!!)
                val imageBytes = inputStream?.use { it.readBytes() } ?: ByteArray(0)
                val requestFile = imageBytes.toRequestBody("image/*".toMediaTypeOrNull())
                val imagePart = MultipartBody.Part.createFormData("image", "image.jpg", requestFile)

                val categoryEnumStr = try {
                    category.uppercase().replace(" & ", "_").replace(" ", "_")
                } catch (e: Exception) {
                    "OTHER"
                }

                val titleBody = category.toRequestBody("text/plain".toMediaTypeOrNull())
                val descriptionBody = description.toRequestBody("text/plain".toMediaTypeOrNull())
                val categoryBody = categoryEnumStr.toRequestBody("text/plain".toMediaTypeOrNull())
                val latBody = selectedLatLng.latitude.toString().toRequestBody("text/plain".toMediaTypeOrNull())
                val lngBody = selectedLatLng.longitude.toString().toRequestBody("text/plain".toMediaTypeOrNull())
                val cityBody = "Chennai".toRequestBody("text/plain".toMediaTypeOrNull())
                val addressBody = area.toRequestBody("text/plain".toMediaTypeOrNull())

                val response = RetrofitClient.getComplaintApi(context).postComplaint(
                    title = titleBody,
                    description = descriptionBody,
                    category = categoryBody,
                    lat = latBody,
                    lng = lngBody,
                    city = cityBody,
                    address = addressBody,
                    image = imagePart
                )
                
                // Firestore Update
                val firestore = com.google.firebase.firestore.FirebaseFirestore.getInstance()
                firestore.collection("complaints").document(id).set(
                    mapOf(
                        "id" to id,
                        "title" to category,
                        "status" to "SUBMITTED",
                        "severityLevel" to severityResult.level.name,
                        "submittedAt" to System.currentTimeMillis()
                    )
                )

                if (!response.isSuccessful) {
                    val errorMsg = response.errorBody()?.string() ?: "Failed to submit complaint"
                    errorMessage = errorMsg
                }
                isUploading = false
            } catch (e: Exception) {
                isUploading = false
                errorMessage = "Network error: ${e.localizedMessage ?: "Unknown error"}"
            }
        }
    }

    Scaffold(
        bottomBar = {
            HomeBottomNavigation(currentRoute = "report", onNavigate = onNavigateTo)
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color.White)
                .verticalScroll(scrollState)
        ) {
            // Header with Gradient
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
                    .background(
                        Brush.verticalGradient(
                            listOf(Color(0xFF00BFA5), Color(0xFF00897B))
                        )
                    )
                    .statusBarsPadding()
            ) {
                Column(Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
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
                            text = category,
                            color = Color.White,
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(start = 12.dp)
                        )
                    }
                    Text(
                        text = "Submit Complaint",
                        color = Color.White.copy(alpha = 0.8f),
                        fontSize = 16.sp,
                        modifier = Modifier.padding(start = 48.dp, top = 2.dp)
                    )
                }
            }

            // Map Picker Box
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(240.dp)
                    .background(Color(0xFFF1F5F9))
                    .clickable {
                        val gmmIntentUri = Uri.parse("geo:${selectedLatLng.latitude},${selectedLatLng.longitude}?q=${selectedLatLng.latitude},${selectedLatLng.longitude}&z=15")
                        val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                        mapIntent.setPackage("com.google.android.apps.maps")
                        try {
                            context.startActivity(mapIntent)
                        } catch (e: Exception) {
                            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/maps/search/?api=1&query=${selectedLatLng.latitude},${selectedLatLng.longitude}"))
                            context.startActivity(browserIntent)
                        }
                    },
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_map_pin),
                        contentDescription = null,
                        tint = Color(0xFF00897B),
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Click to open Google Maps",
                        color = Color(0xFF00897B),
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Pick location & Share back to PublicEye",
                        color = Color(0xFF64748B),
                        fontSize = 12.sp
                    )
                }
            }

            Column(
                modifier = Modifier.padding(20.dp)
            ) {
                // Select Area
                Text(
                    text = "Select area / Address",
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF334155),
                    fontSize = 15.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = area,
                    onValueChange = { area = it },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    leadingIcon = {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_map_pin),
                            contentDescription = null,
                            tint = Color(0xFF94A3B8),
                            modifier = Modifier.size(20.dp)
                        )
                    }
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Description
                Text(
                    text = "Please provide a brief description",
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF334155),
                    fontSize = 15.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    placeholder = { Text("Describe the issue...", color = Color(0xFF94A3B8)) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp),
                    shape = RoundedCornerShape(12.dp)
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Add a photo
                Text(
                    text = "Add a photo",
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF334155),
                    fontSize = 15.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .clickable { imagePickerLauncher.launch("image/*") },
                    shape = RoundedCornerShape(16.dp),
                    color = Color(0xFF1A237E)
                ) {
                    if (selectedImageUri != null) {
                        AsyncImage(
                            model = selectedImageUri,
                            contentDescription = "Selected Photo",
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )
                    } else {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Icon(
                                painter = painterResource(id = R.drawable.ic_camera),
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(44.dp)
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(text = "Tap to upload photo", color = Color.White)
                        }
                    }
                }

                // Severity Section
                if (selectedImageUri != null) {
                    Spacer(modifier = Modifier.height(24.dp))
                    Text(
                        text = "Calculated Severity",
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF334155),
                        fontSize = 15.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    if (severityResult.isLoading) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(60.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFFF1F5F9))
                        ) {
                           CircularProgressIndicator(modifier = Modifier.align(Alignment.Center), color = Color(0xFF00897B))
                        }
                    } else {
                        var showSeverityMenu by remember { mutableStateOf(false) }
                        
                        Column {
                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { showSeverityMenu = true },
                                shape = RoundedCornerShape(12.dp),
                                color = when (severityResult.level) {
                                    SeverityLevel.HIGH -> Color(0xFFFFEBEE)
                                    SeverityLevel.MEDIUM -> Color(0xFFFFF3E0)
                                    SeverityLevel.LOW -> Color(0xFFE8F5E9)
                                },
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    when (severityResult.level) {
                                        SeverityLevel.HIGH -> Color(0xFFF44336)
                                        SeverityLevel.MEDIUM -> Color(0xFFFB8C00)
                                        SeverityLevel.LOW -> Color(0xFF4CAF50)
                                    }
                                )
                            ) {
                                Row(
                                    modifier = Modifier.padding(16.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        painter = painterResource(
                                            id = if (severityResult.level == SeverityLevel.HIGH) R.drawable.ic_warning else R.drawable.ic_info
                                        ),
                                        contentDescription = null,
                                        tint = when (severityResult.level) {
                                            SeverityLevel.HIGH -> Color(0xFFF44336)
                                            SeverityLevel.MEDIUM -> Color(0xFFFB8C00)
                                            SeverityLevel.LOW -> Color(0xFF4CAF50)
                                        },
                                        modifier = Modifier.size(24.dp)
                                    )
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = when (severityResult.level) {
                                                SeverityLevel.HIGH -> "High Priority"
                                                SeverityLevel.MEDIUM -> "Medium Priority"
                                                SeverityLevel.LOW -> "Low Priority"
                                            },
                                            fontWeight = FontWeight.Bold,
                                            color = when (severityResult.level) {
                                                SeverityLevel.HIGH -> Color(0xFFC62828)
                                                SeverityLevel.MEDIUM -> Color(0xFFEF6C00)
                                                SeverityLevel.LOW -> Color(0xFF2E7D32)
                                            }
                                        )
                                        if (severityResult.reason.isNotEmpty()) {
                                            Text(
                                                text = severityResult.reason,
                                                fontSize = 12.sp,
                                                color = Color(0xFF64748B)
                                            )
                                        }
                                    }
                                    Icon(
                                        painter = painterResource(id = R.drawable.ic_arrow_right),
                                        contentDescription = null,
                                        tint = Color(0xFF94A3B8),
                                        modifier = Modifier.size(16.dp).graphicsLayer(rotationZ = 90f)
                                    )
                                }
                            }
                            
                            DropdownMenu(
                                expanded = showSeverityMenu,
                                onDismissRequest = { showSeverityMenu = false }
                            ) {
                                SeverityLevel.entries.forEach { level ->
                                    DropdownMenuItem(
                                        text = { Text(level.name) },
                                        onClick = {
                                            analysisViewModel.setSeverityManually(level)
                                            showSeverityMenu = false
                                        }
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(32.dp))

                // Submit Button
                Button(
                    onClick = { onSubmitClick() },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00897B)),
                    enabled = isSubmitEnabled
                ) {
                    if (isUploading) {
                        CircularProgressIndicator(modifier = Modifier.size(24.dp), color = Color.White)
                    } else {
                        Text(text = "Submit", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                }
                
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
