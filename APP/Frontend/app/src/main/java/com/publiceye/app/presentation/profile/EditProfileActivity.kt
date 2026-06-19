package com.publiceye.app.presentation.profile

import android.content.Context
import android.os.Bundle
import android.preference.PreferenceManager
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.publiceye.app.R
import com.publiceye.app.databinding.ActivityEditProfileBinding
import com.publiceye.app.util.LocaleHelper

class EditProfileActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEditProfileBinding

    override fun attachBaseContext(newBase: Context) {
        super.attachBaseContext(LocaleHelper.onAttach(newBase))
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)
        binding.toolbar.setNavigationOnClickListener { onBackPressed() }

        loadUserData()

        binding.btnSave.setOnClickListener {
            saveUserData()
        }
    }

    private fun loadUserData() {
        val prefs = PreferenceManager.getDefaultSharedPreferences(this)
        binding.etFullName.setText(prefs.getString("user_name", getString(R.string.active_citizen)))
        binding.etPhone.setText(prefs.getString("user_phone", ""))
        binding.etWard.setText(prefs.getString("user_ward", "Ward 12"))
    }

    private fun saveUserData() {
        val name = binding.etFullName.text.toString()
        val phone = binding.etPhone.text.toString()
        val ward = binding.etWard.text.toString()

        if (name.isBlank()) {
            Toast.makeText(this, getString(R.string.name_empty_error), Toast.LENGTH_SHORT).show()
            return
        }

        val prefs = PreferenceManager.getDefaultSharedPreferences(this)
        prefs.edit().apply {
            putString("user_name", name)
            putString("user_phone", phone)
            putString("user_ward", ward)
            apply()
        }

        Toast.makeText(this, getString(R.string.profile_updated), Toast.LENGTH_SHORT).show()
        finish()
    }
}
