package com.publiceye.app.presentation.auth.login

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.publiceye.app.utils.TokenManager
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.auth.status.SessionStatus
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val supabaseAuth: Auth
) : ViewModel() {

    private val _state = MutableStateFlow(LoginState())
    val state = _state.asStateFlow()
    
    private val tokenManager = TokenManager(context)

    fun onEmailChange(email: String) {
        // Remove spaces while typing
        val filteredEmail = email.filter { !it.isWhitespace() }
        _state.update { it.copy(email = filteredEmail, error = null) }
    }

    fun onPasswordChange(password: String) {
        _state.update { it.copy(password = password, error = null) }
    }

    fun togglePasswordVisibility() {
        _state.update { it.copy(isPasswordVisible = !it.isPasswordVisible) }
    }

    fun onSignInClick(onSuccess: () -> Unit) {
        val email = _state.value.email.trim().lowercase()
        val password = _state.value.password.trim()
        
        if (email.isEmpty() || password.isEmpty()) {
            _state.update { it.copy(error = "Please fill in all fields") }
            return
        }

        // 1. Client-side email validation
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            _state.update { it.copy(error = "Please enter a valid email address") }
            return
        }

        _state.update { it.copy(isLoading = true, error = null) }
        
        viewModelScope.launch {
            try {
                // Sign in to Supabase
                supabaseAuth.signInWith(Email) {
                    this.email = email
                    this.password = password
                }
                
                val user = supabaseAuth.currentUserOrNull()
                val session = supabaseAuth.currentSessionOrNull()

                // 2. Check if email is confirmed
                if (user != null && user.emailConfirmedAt == null) {
                    supabaseAuth.signOut() // Sign out because the session is technically created but not authorized for use by business logic
                    _state.update { 
                        it.copy(
                            isLoading = false, 
                            error = "Email not verified. Please check your inbox and click the activation link." 
                        ) 
                    }
                    return@launch
                }
                
                if (session != null) {
                    tokenManager.saveToken(session.accessToken)
                    _state.update { it.copy(isLoading = false) }
                    onSuccess()
                } else {
                    _state.update { it.copy(isLoading = false, error = "Login failed: No session") }
                }
            } catch (e: Exception) {
                val errorMessage = when {
                    e.message?.contains("invalid_credentials", ignoreCase = true) == true -> 
                        "Invalid email or password. Please try again."
                    e.message?.contains("Email not confirmed", ignoreCase = true) == true ->
                        "Your email is not verified. Please check your inbox."
                    else -> e.localizedMessage?.substringBefore("\n") ?: "Login failed"
                }
                _state.update { 
                    it.copy(
                        isLoading = false, 
                        error = errorMessage
                    ) 
                }
            }
        }
    }
}
