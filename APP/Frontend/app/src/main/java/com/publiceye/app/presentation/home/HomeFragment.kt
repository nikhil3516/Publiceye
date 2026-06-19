package com.publiceye.app.presentation.home

import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.publiceye.app.R
import com.publiceye.app.databinding.FragmentHomeBinding
import com.publiceye.app.databinding.ItemFeatureCardBinding
import java.util.*

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupDynamicGreeting()
        setupFeatureGrid()
    }

    private fun setupDynamicGreeting() {
        val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
        val greeting: String
        val colors: IntArray

        when (hour) {
            in 0..11 -> {
                greeting = "Good Morning ☀️"
                colors = intArrayOf(0xFFFFAB40.toInt(), 0xFFFF6D00.toInt())
            }
            in 12..16 -> {
                greeting = "Good Afternoon 🌤️"
                colors = intArrayOf(0xFF00BFA5.toInt(), 0xFF004D40.toInt())
            }
            in 17..20 -> {
                greeting = "Good Evening 🌆"
                colors = intArrayOf(0xFFFF6D00.toInt(), 0xFF00BFA5.toInt())
            }
            else -> {
                greeting = "Good Night 🌙"
                colors = intArrayOf(0xFF0A1628.toInt(), 0xFF1A237E.toInt())
            }
        }

        binding.tvGreeting.text = greeting
        val gd = GradientDrawable(GradientDrawable.Orientation.BR_TL, colors)
        gd.cornerRadius = resources.getDimension(R.dimen.card_corner_radius)
        binding.greetingGradient.background = gd
    }

    private fun setupFeatureGrid() {
        setupCard(ItemFeatureCardBinding.bind(binding.cardReportIssue.root), 
            "Report Issue", "Report civic problems", R.drawable.ic_3d_report_issue, 
            intArrayOf(0xFFFF6D00.toInt(), 0xFFFF8F00.toInt())) {
            findNavController().navigate(R.id.reportIssueFragment)
        }

        setupCard(ItemFeatureCardBinding.bind(binding.cardFeedback.root), 
            "Citizen Feedback", "Share your thoughts", R.drawable.ic_3d_citizen_feedback, 
            intArrayOf(0xFF00BFA5.toInt(), 0xFF004D40.toInt())) {
        }

        setupCard(ItemFeatureCardBinding.bind(binding.cardFacilities.root), 
            "Find Facilities", "Locate nearby services", R.drawable.ic_3d_find_facilities, 
            intArrayOf(0xFF1565C0.toInt(), 0xFF1E88E5.toInt())) {
        }

        setupCard(ItemFeatureCardBinding.bind(binding.cardRate.root), 
            "Rate Services", "Rate civic services", R.drawable.ic_3d_rate_services, 
            intArrayOf(0xFFF9A825.toInt(), 0xFFFFD54F.toInt())) {
        }

        setupCard(ItemFeatureCardBinding.bind(binding.cardTrack.root), 
            "Track Complaint", "Live tracking", R.drawable.ic_3d_tracking, 
            intArrayOf(0xFF00BFA5.toInt(), 0xFF0A1628.toInt())) {
        }

        setupCard(ItemFeatureCardBinding.bind(binding.cardAI.root), 
            "AI Scan", "Analyze issue depth", R.drawable.ic_3d_ai_scan, 
            intArrayOf(0xFF4A148C.toInt(), 0xFF7B1FA2.toInt())) {
        }

        setupCard(ItemFeatureCardBinding.bind(binding.cardNotifications.root), 
            "Notifications", "Stay updated", R.drawable.ic_3d_notifications, 
            intArrayOf(0xFF00838F.toInt(), 0xFF00ACC1.toInt())) {
        }

        setupCard(ItemFeatureCardBinding.bind(binding.cardComplaints.root), 
            "My Complaints", "View your history", R.drawable.ic_3d_complaints, 
            intArrayOf(0xFF0A1628.toInt(), 0xFF1A237E.toInt())) {
        }
    }

    private fun setupCard(cardBinding: ItemFeatureCardBinding, title: String, subtitle: String, icon: Int, colors: IntArray, onClick: () -> Unit) {
        cardBinding.tvTitle.text = title
        cardBinding.tvSubtitle.text = subtitle
        cardBinding.ivIcon.setImageResource(icon)
        
        val gd = GradientDrawable(GradientDrawable.Orientation.TL_BR, colors)
        gd.cornerRadius = resources.getDimension(R.dimen.card_corner_radius)
        cardBinding.cardBg.background = gd
        cardBinding.root.setOnClickListener { onClick() }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
