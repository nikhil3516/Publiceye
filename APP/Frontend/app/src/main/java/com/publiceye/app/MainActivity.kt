package com.publiceye.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.publiceye.app.databinding.ActivityMainBinding
import com.publiceye.app.databinding.LayoutFabMenuBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.main_nav_host_fragment) as NavHostFragment
        val navController = navHostFragment.navController
        
        binding.bottomNavigationView.setupWithNavController(navController)
        binding.bottomNavigationView.background = null // Transparent to show BottomAppBar cradle

        binding.fabAdd.setOnClickListener {
            showFabMenu()
        }
    }

    private fun showFabMenu() {
        val dialog = BottomSheetDialog(this, R.style.BottomSheetDialogTheme)
        val fabBinding = LayoutFabMenuBinding.inflate(layoutInflater)
        dialog.setContentView(fabBinding.root)

        fabBinding.menuReport.setOnClickListener {
            dialog.dismiss()
            // Navigate to Report Issue
        }

        fabBinding.menuFeedback.setOnClickListener {
            dialog.dismiss()
            // Navigate to Feedback
        }

        fabBinding.menuRate.setOnClickListener {
            dialog.dismiss()
            // Navigate to Rate
        }

        dialog.show()
    }
}
