package com.publiceye.app.presentation.auth.register

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.publiceye.app.data.models.SupabaseUser
import com.publiceye.app.utils.TokenManager
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.postgrest.Postgrest
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import javax.inject.Inject

@HiltViewModel
class RegisterViewModel @Inject constructor(
    @ApplicationContext private val context: Context,
    private val supabaseAuth: Auth,
    private val postgrest: Postgrest
) : ViewModel() {

    private val _state = MutableStateFlow(RegisterState())
    val state = _state.asStateFlow()

    private val tokenManager = TokenManager(context)

    fun onFullNameChange(name: String) {
        _state.update { it.copy(fullName = name, error = null) }
    }

    fun onEmailChange(email: String) {
        // Remove spaces while typing
        val filteredEmail = email.filter { !it.isWhitespace() }
        _state.update { it.copy(email = filteredEmail, error = null) }
    }

    fun onPhoneChange(phone: String) {
        _state.update { it.copy(phone = phone, error = null) }
    }

    fun onWardChange(ward: String) {
        _state.update { it.copy(ward = ward, error = null) }
    }

    fun onCityChange(city: String) {
        _state.update { it.copy(city = city, error = null) }
    }

    fun onPasswordChange(password: String) {
        _state.update { it.copy(password = password, error = null) }
    }

    fun onConfirmPasswordChange(password: String) {
        _state.update { it.copy(confirmPassword = password, error = null) }
    }

    fun togglePasswordVisibility() {
        _state.update { it.copy(isPasswordVisible = !it.isPasswordVisible) }
    }

    fun onCreateAccountClick(onSuccess: () -> Unit) {
        if (_state.value.isLoading) return // Prevent multiple clicks

        val fullName = _state.value.fullName.trim()
        val email = _state.value.email.trim().lowercase()
        val phone = _state.value.phone.trim()
        val ward = _state.value.ward.trim()
        val city = _state.value.city.trim()
        val password = _state.value.password // Don't trim password
        val confirmPassword = _state.value.confirmPassword

        if (fullName.isEmpty() || email.isEmpty() || phone.isEmpty() || ward.isEmpty() || city.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
            _state.update { it.copy(error = "Please fill in all fields") }
            return
        }

        if (password != confirmPassword) {
            _state.update { it.copy(error = "Passwords do not match") }
            return
        }

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            _state.update { it.copy(error = "Invalid email format") }
            return
        }

        _state.update { it.copy(isLoading = true, error = null) }

        viewModelScope.launch {
            try {
                // 1. Sign Up with Supabase Auth including user metadata
                supabaseAuth.signUpWith(Email) {
                    this.email = email
                    this.password = password
                    data = buildJsonObject {
                        put("full_name", fullName)
                        put("phone", phone)
                        put("ward", ward)
                        put("city", city)
                    }
                }

                // Get the user from the response
                val user = supabaseAuth.currentUserOrNull() 
                
                // If user is returned (even if unconfirmed), try to save to public.users
                user?.let {
                    val userData = SupabaseUser(
                        id = it.id,
                        full_name = fullName,
                        email = email,
                        phone = phone,
                        ward = ward,
                        city = city,
                        created_at = System.currentTimeMillis()
                    )
                    try {
                        postgrest.from("users").insert(userData)
                    } catch (e: Exception) {
                        // Log error but don't fail registration if table insert fails
                        // User is still created in Auth
                    }
                }

                _state.update { it.copy(isLoading = false, registrationSuccess = true) }

            } catch (e: Exception) {
                val errorMessage = when {
                    e.message?.contains("email_address_invalid", ignoreCase = true) == true -> 
                        "The email address is invalid. Please check for spaces or typos."
                    e.message?.contains("user_already_exists", ignoreCase = true) == true -> 
                        "An account with this email already exists."
                    e.message?.contains("signup_disabled", ignoreCase = true) == true -> 
                        "Sign up is currently disabled."
                    e.message?.contains("over_email_send_rate_limit", ignoreCase = true) == true ->
                        "Too many requests. Please wait a few minutes before trying again."
                    e.message?.contains("Could not find the table", ignoreCase = true) == true ->
                        "Database Error: The 'users' table is missing in Supabase. Please create it in the SQL Editor."
                    else -> e.localizedMessage?.substringBefore("\n") ?: "Registration failed"
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

