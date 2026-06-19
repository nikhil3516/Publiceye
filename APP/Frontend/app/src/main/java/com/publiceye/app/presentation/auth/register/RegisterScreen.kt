package com.publiceye.app.presentation.auth.register

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.publiceye.app.R
import com.publiceye.app.presentation.theme.PublicEyeTheme

@Composable
fun RegisterScreen(
    onNavigateToLogin: () -> Unit,
    onNavigateToHome: () -> Unit,
    viewModel: RegisterViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()
    val scrollState = rememberScrollState()

    if (state.registrationSuccess) {
        AlertDialog(
            onDismissRequest = { /* Prevent dismiss */ },
            title = { Text("Registration Successful", fontWeight = FontWeight.Bold) },
            text = {
                Text("We've sent a confirmation email to ${state.email}. \n\nPlease check your inbox and click the activation link to verify your account before logging in.")
            },
            confirmButton = {
                Button(
                    onClick = onNavigateToLogin,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2962FF))
                ) {
                    Text("Go to Login")
                }
            },
            shape = RoundedCornerShape(24.dp),
            containerColor = Color.White
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF40C4FF), // Bright Blue
                        Color(0xFFFFFFFF)  // White bottom
                    )
                )
            )
            .imePadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 24.dp),
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_logo_eye),
                    contentDescription = null,
                    tint = Color.Unspecified,
                    modifier = Modifier.size(32.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "PublicEye",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 26.sp
                )
            }

            // Main Content Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                shape = RoundedCornerShape(32.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp)
                        .verticalScroll(scrollState),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = stringResource(id = R.string.create_account),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1A1C1E)
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = stringResource(id = R.string.register_subtitle),
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFF64748B)
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    // Full Name
                    RegisterTextField(
                        label = stringResource(id = R.string.full_name_label),
                        value = state.fullName,
                        onValueChange = viewModel::onFullNameChange,
                        placeholder = stringResource(id = R.string.full_name_placeholder),
                        leadingIcon = R.drawable.ic_user
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Email
                    RegisterTextField(
                        label = stringResource(id = R.string.email_label),
                        value = state.email,
                        onValueChange = viewModel::onEmailChange,
                        placeholder = "your.email@example.com",
                        leadingIcon = R.drawable.ic_placeholder, // Envelope/Email icon placeholder
                        keyboardType = KeyboardType.Email
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Phone Number
                    RegisterTextField(
                        label = stringResource(id = R.string.phone_label),
                        value = state.phone,
                        onValueChange = viewModel::onPhoneChange,
                        placeholder = stringResource(id = R.string.phone_placeholder),
                        leadingIcon = R.drawable.ic_placeholder, // Phone icon placeholder
                        keyboardType = KeyboardType.Phone
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Ward and City side-by-side
                    Row(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = stringResource(id = R.string.ward_label),
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.SemiBold,
                                color = Color(0xFF1A1C1E),
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                            OutlinedTextField(
                                value = state.ward,
                                onValueChange = viewModel::onWardChange,
                                placeholder = { Text(stringResource(id = R.string.ward_placeholder)) },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(14.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color(0xFF2962FF),
                                    unfocusedBorderColor = Color(0xFFE2E8F0),
                                    focusedContainerColor = Color(0xFFF8FAFC),
                                    unfocusedContainerColor = Color(0xFFF8FAFC)
                                ),
                                singleLine = true
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = stringResource(id = R.string.city_label),
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.SemiBold,
                                color = Color(0xFF1A1C1E),
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                            OutlinedTextField(
                                value = state.city,
                                onValueChange = viewModel::onCityChange,
                                placeholder = { Text(stringResource(id = R.string.city_placeholder)) },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(14.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color(0xFF2962FF),
                                    unfocusedBorderColor = Color(0xFFE2E8F0),
                                    focusedContainerColor = Color(0xFFF8FAFC),
                                    unfocusedContainerColor = Color(0xFFF8FAFC)
                                ),
                                singleLine = true
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Password
                    RegisterTextField(
                        label = stringResource(id = R.string.password_label),
                        value = state.password,
                        onValueChange = viewModel::onPasswordChange,
                        placeholder = stringResource(id = R.string.password_create_placeholder),
                        leadingIcon = R.drawable.ic_lock,
                        keyboardType = KeyboardType.Password,
                        isPassword = true,
                        isPasswordVisible = state.isPasswordVisible,
                        onToggleVisibility = viewModel::togglePasswordVisibility
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Confirm Password
                    RegisterTextField(
                        label = stringResource(id = R.string.confirm_password_label),
                        value = state.confirmPassword,
                        onValueChange = viewModel::onConfirmPasswordChange,
                        placeholder = stringResource(id = R.string.confirm_password_placeholder),
                        leadingIcon = R.drawable.ic_lock,
                        keyboardType = KeyboardType.Password,
                        isPassword = true,
                        isPasswordVisible = state.isPasswordVisible,
                        onToggleVisibility = viewModel::togglePasswordVisibility
                    )

                    Spacer(modifier = Modifier.height(32.dp))

                    if (state.error != null) {
                        Text(
                            text = state.error!!,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodyMedium,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )
                    }

                    // Create Account Button
                    Button(
                        onClick = { viewModel.onCreateAccountClick(onNavigateToLogin) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2962FF)),
                        enabled = !state.isLoading
                    ) {
                        if (state.isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(24.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Text(
                                text = stringResource(id = R.string.create_account),
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Login Link
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = stringResource(id = R.string.already_have_account),
                            color = Color(0xFF64748B),
                            fontSize = 14.sp
                        )
                        TextButton(onClick = onNavigateToLogin) {
                            Text(
                                text = stringResource(id = R.string.sign_in_link),
                                color = Color(0xFF2962FF),
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(80.dp))
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun RegisterTextField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    leadingIcon: Int,
    keyboardType: KeyboardType = KeyboardType.Text,
    isPassword: Boolean = false,
    isPasswordVisible: Boolean = false,
    onToggleVisibility: (() -> Unit)? = null
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelLarge,
            fontWeight = FontWeight.SemiBold,
            color = Color(0xFF1A1C1E),
            modifier = Modifier.padding(bottom = 8.dp)
        )
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = { Text(placeholder) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            leadingIcon = {
                Icon(
                    painter = painterResource(id = leadingIcon),
                    contentDescription = null,
                    modifier = Modifier.size(20.dp),
                    tint = Color(0xFF94A3B8)
                )
            },
            trailingIcon = if (isPassword) {
                {
                    IconButton(onClick = { onToggleVisibility?.invoke() }) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_eye),
                            contentDescription = null,
                            modifier = Modifier.size(20.dp),
                            tint = Color(0xFF94A3B8)
                        )
                    }
                }
            } else null,
            visualTransformation = if (isPassword && !isPasswordVisible) PasswordVisualTransformation() else VisualTransformation.None,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Color(0xFF2962FF),
                unfocusedBorderColor = Color(0xFFE2E8F0),
                focusedContainerColor = Color(0xFFF8FAFC),
                unfocusedContainerColor = Color(0xFFF8FAFC)
            ),
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
            singleLine = true
        )
    }
}

@Preview(showBackground = true)
@Composable
fun RegisterScreenPreview() {
    PublicEyeTheme {
        RegisterScreen({}, {})
    }
}
