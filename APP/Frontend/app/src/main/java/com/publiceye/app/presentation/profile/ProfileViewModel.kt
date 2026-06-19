package com.publiceye.app.presentation.profile

import android.app.Application
import android.preference.PreferenceManager
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AndroidViewModel
import com.publiceye.app.R
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class ProfileViewModel @Inject constructor(
    application: Application
) : AndroidViewModel(application) {

    private val prefs = PreferenceManager.getDefaultSharedPreferences(application)
    
    private val _userName = mutableStateOf(prefs.getString("user_name", application.getString(R.string.active_citizen)) ?: application.getString(R.string.active_citizen))
    val userName: State<String> = _userName

    private val _userWard = mutableStateOf(prefs.getString("user_ward", "Ward 12") ?: "Ward 12")
    val userWard: State<String> = _userWard

    private val _profileImageUri = mutableStateOf(prefs.getString("profile_image", null))
    val profileImageUri: State<String?> = _profileImageUri

    fun refreshData() {
        _userName.value = prefs.getString("user_name", getApplication<Application>().getString(R.string.active_citizen)) ?: getApplication<Application>().getString(R.string.active_citizen)
        _userWard.value = prefs.getString("user_ward", "Ward 12") ?: "Ward 12"
        _profileImageUri.value = prefs.getString("profile_image", null)
    }

    fun updateProfileImage(uri: String) {
        prefs.edit().putString("profile_image", uri).apply()
        _profileImageUri.value = uri
    }
}
