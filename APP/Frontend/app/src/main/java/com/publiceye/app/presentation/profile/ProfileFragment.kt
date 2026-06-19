package com.publiceye.app.presentation.profile

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.publiceye.app.R
import com.publiceye.app.databinding.FragmentProfileBinding
import com.publiceye.app.databinding.ItemProfileMenuBinding

class ProfileFragment : Fragment() {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupMenu()
    }

    private fun setupMenu() {
        setupMenuItem(ItemProfileMenuBinding.bind(binding.menuEdit.root), "Edit Profile", R.drawable.ic_3d_edit_profile) {
            // Navigate to Edit Profile
        }

        setupMenuItem(ItemProfileMenuBinding.bind(binding.menuNotifications.root), "Notifications", R.drawable.ic_3d_notifications) {
            // Navigate to Notifications
        }

        setupMenuItem(ItemProfileMenuBinding.bind(binding.menuLanguage.root), "Change Language", R.drawable.ic_3d_language) {
            // Show language dialog
        }

        setupMenuItem(ItemProfileMenuBinding.bind(binding.menuRate.root), "Rate on Play Store", R.drawable.ic_3d_rate_services) {
            // Open Play Store
        }

        setupMenuItem(ItemProfileMenuBinding.bind(binding.menuPrivacy.root), "Privacy Policy", R.drawable.ic_3d_privacy) {
            // Open Privacy URL
        }

        setupMenuItem(ItemProfileMenuBinding.bind(binding.menuWhatsNew.root), "What\'s New", R.drawable.ic_3d_whats_new) {
            // Show changelog
        }

        setupMenuItem(ItemProfileMenuBinding.bind(binding.menuReport.root), "Report Issue", R.drawable.ic_3d_report_issue) {
            // Navigate to Report Issue
        }

        setupMenuItem(ItemProfileMenuBinding.bind(binding.menuLogout.root), "Logout", R.drawable.ic_3d_logout) {
            // Confirmation dialog and logout
        }
    }

    private fun setupMenuItem(menuBinding: ItemProfileMenuBinding, title: String, icon: Int, onClick: () -> Unit) {
        menuBinding.tvTitle.text = title
        menuBinding.ivIcon.setImageResource(icon)
        menuBinding.root.setOnClickListener { onClick() }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
