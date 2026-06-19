package com.publiceye.app.presentation.complaints.track

import android.animation.ObjectAnimator
import android.animation.PropertyValuesHolder
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.firebase.firestore.FirebaseFirestore
import com.publiceye.app.databinding.ActivityComplaintTrackingBinding
import android.text.format.DateUtils
import com.publiceye.app.util.SLAConfig
import java.text.SimpleDateFormat
import java.util.*

class ComplaintTrackingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityComplaintTrackingBinding
    private val db = FirebaseFirestore.getInstance()
    private lateinit var adapter: TimelineAdapter
    private var complaintId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityComplaintTrackingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        complaintId = intent.getStringExtra("COMPLAINT_ID") ?: return
        
        setupToolbar()
        setupRecyclerView()
        listenToComplaintUpdates()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        binding.toolbar.setNavigationOnClickListener { finish() }
    }

    private fun setupRecyclerView() {
        adapter = TimelineAdapter(emptyList())
        binding.rvTimeline.layoutManager = LinearLayoutManager(this)
        binding.rvTimeline.adapter = adapter
    }

    private fun listenToComplaintUpdates() {
        complaintId?.let { id ->
            db.collection("complaints").document(id)
                .addSnapshotListener { snapshot, error ->
                    if (error != null) return@addSnapshotListener
                    
                    snapshot?.let { doc ->
                        updateUI(doc.data ?: return@addSnapshotListener)
                    }
                }
        }
    }

    private fun updateUI(data: Map<String, Any>) {
        val title = data["title"] as? String ?: ""
        val status = data["status"] as? String ?: "SUBMITTED"
        val department = data["department"] as? String ?: "Not Assigned"
        val officer = data["officer"] as? String ?: "Not Assigned"
        val submittedAt = data["submittedAt"] as? Long ?: System.currentTimeMillis()
        val severity = data["severityLevel"] as? String ?: "MEDIUM"

        binding.tvComplaintId.text = "Complaint #$complaintId"
        binding.tvComplaintTitle.text = title
        binding.tvDepartment.text = department
        binding.tvOfficer.text = officer

        val timelineItems = generateTimeline(status, data)
        adapter.updateItems(timelineItems)
        
        updateSLACard(submittedAt, severity, status)
    }

    private fun generateTimeline(currentStatus: String, data: Map<String, Any>): List<TimelineItem> {
        val stages = listOf(
            "SUBMITTED" to "Complaint Submitted",
            "UNDER_REVIEW" to "Under Review",
            "ASSIGNED" to "Assigned to Department",
            "WORK_IN_PROGRESS" to "Work In Progress",
            "RESOLVED" to "Resolved"
        )

        val items = mutableListOf<TimelineItem>()
        var foundActive = false

        for ((code, label) in stages) {
            val status = when {
                code == currentStatus -> {
                    foundActive = true
                    TimelineStatus.ACTIVE
                }
                !foundActive -> TimelineStatus.COMPLETED
                else -> TimelineStatus.PENDING
            }
            
            val timestamp = if (status == TimelineStatus.COMPLETED || status == TimelineStatus.ACTIVE) {
                // In real app, we'd get specific timestamps for each stage from Firestore
                SimpleDateFormat("dd MMM, hh:mm a", Locale.getDefault()).format(Date())
            } else ""

            items.add(TimelineItem(label, getStatusMessage(code), timestamp, status))
        }
        return items
    }

    private fun getStatusMessage(status: String) = when (status) {
        "SUBMITTED" -> "Your complaint has been successfully recorded."
        "UNDER_REVIEW" -> "Our team is reviewing the details of your complaint."
        "ASSIGNED" -> "Complaint has been assigned to the relevant department."
        "WORK_IN_PROGRESS" -> "Field workers have started working on the issue."
        "RESOLVED" -> "The issue has been resolved. Thank you for your patience."
        else -> ""
    }

    private fun updateSLACard(submittedAt: Long, severity: String, status: String) {
        val deadline = SLAConfig.getDeadline(submittedAt, severity)
        val now = System.currentTimeMillis()
        val timeLeft = deadline - now
        val totalTime = SLAConfig.getDeadline(0, severity) // Simplified for calculation
        
        val progress = (timeLeft.toFloat() / totalTime.toFloat()).coerceIn(0f, 1f)
        
        val df = SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault())
        binding.tvSlaDeadline.text = "Due by: ${df.format(Date(deadline))}"

        if (status == "RESOLVED") {
            binding.slaCard.visibility = View.GONE
            return
        }

        if (timeLeft < 0) {
            binding.tvSlaStatus.text = "Breached 🚨"
            binding.tvSlaStatus.setTextColor(getColor(android.R.color.holo_red_dark))
            binding.tvSlaCountdown.text = "OVERDUE"
            binding.slaTimerView.setProgress(1f, getColor(android.R.color.holo_red_dark))
        } else {
            val days = timeLeft / (24 * 60 * 60 * 1000)
            val hours = (timeLeft / (60 * 60 * 1000)) % 24
            binding.tvSlaCountdown.text = "$days day $hours hrs remaining"
            
            val color = when {
                progress > 0.5f -> getColor(com.publiceye.app.R.color.severity_low)
                progress > 0.25f -> getColor(com.publiceye.app.R.color.severity_medium)
                else -> getColor(com.publiceye.app.R.color.severity_high)
            }
            
            binding.tvSlaStatus.text = if (progress > 0.25f) "On Track ✅" else "At Risk ⚠️"
            binding.tvSlaStatus.setTextColor(color)
            binding.slaTimerView.setProgress(progress, color)
        }
    }
}
