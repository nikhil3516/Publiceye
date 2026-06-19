package com.publiceye.app.presentation.auth.register

data class RegisterState(
    val fullName: String = "",
    val email: String = "",
    val phone: String = "",
    val ward: String = "",
    val city: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val isPasswordVisible: Boolean = false,
    val isLoading: Boolean = false,
    val registrationSuccess: Boolean = false,
    val error: String? = null
)
