package com.publiceye.app.presentation.auth.forgotpassword

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.github.jan.supabase.auth.Auth
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ForgotPasswordViewModel @Inject constructor(
    private val supabaseAuth: Auth
) : ViewModel() {

    private val _state = MutableStateFlow(ForgotPasswordState())
    val state = _state.asStateFlow()

    fun onEmailChange(email: String) {
        _state.update { it.copy(email = email, error = null) }
    }

    fun onSendCodeClick() {
        val email = _state.value.email.trim()
        if (email.isEmpty()) {
            _state.update { it.copy(error = "Please enter your email address") }
            return
        }

        _state.update { it.copy(isLoading = true, error = null) }
        
        viewModelScope.launch {
            try {
                supabaseAuth.resetPasswordForEmail(email)
                _state.update { it.copy(isLoading = false, isCodeSent = true) }
            } catch (e: Exception) {
                _state.update {
                    it.copy(
                        isLoading = false,
                        error = e.localizedMessage ?: "Failed to send reset email"
                    )
                }
            }
        }
    }
}
