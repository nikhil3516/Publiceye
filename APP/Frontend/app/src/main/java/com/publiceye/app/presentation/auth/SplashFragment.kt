package com.publiceye.app.presentation.auth

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateDecelerateInterpolator
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.publiceye.app.MainActivity
import com.publiceye.app.R
import com.publiceye.app.databinding.FragmentSplashBinding
import com.publiceye.app.presentation.onboarding.OnboardingActivity

class SplashFragment : Fragment() {

    private var _binding: FragmentSplashBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSplashBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        animateLogo()

        Handler(Looper.getMainLooper()).postDelayed({
            checkStatusAndNavigate()
        }, 3000)
    }

    private fun animateLogo() {
        binding.ivLogo.animate()
            .scaleX(1.0f)
            .scaleY(1.0f)
            .alpha(1.0f)
            .setDuration(1200)
            .setInterpolator(AccelerateDecelerateInterpolator())
            .start()

        binding.tvAppName.animate()
            .alpha(1.0f)
            .setDuration(1200)
            .setStartDelay(500)
            .start()
    }

    private fun checkStatusAndNavigate() {
        if (!isAdded) return

        val sharedPref = requireActivity().getSharedPreferences("PublicEyePrefs", Context.MODE_PRIVATE)
        val onboardingDone = sharedPref.getBoolean("onboarding_done", false)
        val isLoggedIn = sharedPref.getString("auth_token", null) != null

        if (!onboardingDone) {
            startActivity(Intent(requireContext(), OnboardingActivity::class.java))
            requireActivity().finish()
        } else if (isLoggedIn) {
            startActivity(Intent(requireContext(), MainActivity::class.java))
            requireActivity().finish()
        } else {
            findNavController().navigate(R.id.action_splashFragment_to_loginFragment)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
