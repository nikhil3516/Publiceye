package com.publiceye.app.presentation.auth.forgotpassword

data class ForgotPasswordState(
    val email: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val isCodeSent: Boolean = false
)
