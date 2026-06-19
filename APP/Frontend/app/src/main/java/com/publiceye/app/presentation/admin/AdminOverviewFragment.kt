package com.publiceye.app.presentation.admin

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.publiceye.app.databinding.FragmentAdminOverviewBinding
import com.publiceye.app.databinding.ItemAdminStatBinding

class AdminOverviewFragment : Fragment() {

    private var _binding: FragmentAdminOverviewBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAdminOverviewBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupStats()
    }

    private fun setupStats() {
        val totalBinding = ItemAdminStatBinding.bind(binding.statTotal.root)
        totalBinding.tvStatLabel.text = "Total Issues"
        totalBinding.tvStatValue.text = "124"

        val resolvedBinding = ItemAdminStatBinding.bind(binding.statResolved.root)
        resolvedBinding.tvStatLabel.text = "Resolved Today"
        resolvedBinding.tvStatValue.text = "18"
        
        val breachedBinding = ItemAdminStatBinding.bind(binding.statBreached.root)
        breachedBinding.tvStatLabel.text = "SLA Breached"
        breachedBinding.tvStatValue.text = "5"
        
        val usersBinding = ItemAdminStatBinding.bind(binding.statUsers.root)
        usersBinding.tvStatLabel.text = "Active Users"
        usersBinding.tvStatValue.text = "892"
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
