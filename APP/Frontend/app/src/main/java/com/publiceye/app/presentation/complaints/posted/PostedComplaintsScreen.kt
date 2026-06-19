package com.publiceye.app.presentation.complaints.posted

import androidx.compose.runtime.Composable
import androidx.compose.ui.viewinterop.AndroidView
import android.view.LayoutInflater
import com.publiceye.app.databinding.ActivityPostedComplaintsBinding

@Composable
fun PostedComplaintsScreen(
    onNavigateBack: () -> Unit,
    onNavigateTo: (String) -> Unit
) {
    AndroidView(
        factory = { context ->
            val binding = ActivityPostedComplaintsBinding.inflate(LayoutInflater.from(context))
            
            binding.toolbar.setNavigationOnClickListener {
                onNavigateBack()
            }
            
            binding.bottomNavigation.selectedItemId = com.publiceye.app.R.id.nav_complaints
            
            binding.bottomNavigation.setOnItemSelectedListener { item ->
                when (item.itemId) {
                    com.publiceye.app.R.id.nav_home -> onNavigateTo("home")
                    com.publiceye.app.R.id.nav_notifications -> onNavigateTo("notifications")
                    com.publiceye.app.R.id.nav_complaints -> onNavigateTo("complaints")
                    com.publiceye.app.R.id.nav_profile -> onNavigateTo("profile")
                }
                true
            }
            
            binding.fab.setOnClickListener {
                onNavigateTo("report_issue")
            }
            
            binding.root
        }
    )
}
