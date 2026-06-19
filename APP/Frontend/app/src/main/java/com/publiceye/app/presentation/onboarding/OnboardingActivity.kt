package com.publiceye.app.presentation.onboarding

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.ViewPager2
import com.google.android.material.tabs.TabLayoutMediator
import com.publiceye.app.R
import com.publiceye.app.databinding.ActivityOnboardingBinding
import com.publiceye.app.databinding.ItemOnboardingBinding
import com.publiceye.app.presentation.auth.AuthActivity

class OnboardingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityOnboardingBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOnboardingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val adapter = OnboardingAdapter()
        binding.viewPager.adapter = adapter

        TabLayoutMediator(binding.tabLayout, binding.viewPager) { _, _ -> }.attach()

        binding.viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                updateBackground(position)
                if (position == 2) {
                    binding.btnNext.setText(R.string.get_started_btn)
                } else {
                    binding.btnNext.setText(R.string.next)
                }
            }
        })

        binding.btnNext.setOnClickListener {
            if (binding.viewPager.currentItem < 2) {
                binding.viewPager.currentItem += 1
            } else {
                finishOnboarding()
            }
        }

        binding.btnSkip.setOnClickListener { finishOnboarding() }
    }

    private fun updateBackground(position: Int) {
        val colors = when (position) {
            0 -> intArrayOf(Color.parseColor("#0A1628"), Color.parseColor("#004D40"))
            1 -> intArrayOf(Color.parseColor("#0A1628"), Color.parseColor("#0A1628"))
            2 -> intArrayOf(Color.parseColor("#00BFA5"), Color.parseColor("#004D40"))
            else -> intArrayOf(Color.parseColor("#0A1628"), Color.parseColor("#004D40"))
        }
        val gd = GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, colors)
        binding.root.background = gd
    }

    private fun finishOnboarding() {
        val sharedPref = getSharedPreferences("PublicEyePrefs", Context.MODE_PRIVATE)
        val editor = sharedPref.edit()
        editor.putBoolean("onboarding_done", true)
        editor.apply()
        startActivity(Intent(this, AuthActivity::class.java))
        finish()
    }

    inner class OnboardingAdapter : RecyclerView.Adapter<OnboardingAdapter.OnboardingViewHolder>() {

        private val items = listOf(
            OnboardingItem(R.string.onboarding_title_1, R.string.onboarding_desc_1, R.drawable.ic_app_logo_3d),
            OnboardingItem(R.string.onboarding_title_2, R.string.onboarding_desc_2, R.drawable.ic_3d_ai_scan),
            OnboardingItem(R.string.onboarding_title_3, R.string.onboarding_desc_3, R.drawable.ic_3d_tracking)
        )

        inner class OnboardingViewHolder(val binding: ItemOnboardingBinding) : RecyclerView.ViewHolder(binding.root)

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OnboardingViewHolder {
            val binding = ItemOnboardingBinding.inflate(LayoutInflater.from(parent.context), parent, false)
            return OnboardingViewHolder(binding)
        }

        override fun onBindViewHolder(holder: OnboardingViewHolder, position: Int) {
            val item = items[position]
            holder.binding.tvTitle.setText(item.titleRes)
            holder.binding.tvDescription.setText(item.descRes)
            holder.binding.ivIcon.setImageResource(item.icon)
        }

        override fun getItemCount(): Int = items.size
    }

    data class OnboardingItem(val titleRes: Int, val descRes: Int, val icon: Int)
}
