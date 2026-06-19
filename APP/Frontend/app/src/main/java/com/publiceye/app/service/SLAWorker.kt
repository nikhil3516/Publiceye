package com.publiceye.app.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.publiceye.app.PublicEyeApp
import com.publiceye.app.R
import com.publiceye.app.util.SLAConfig

class SLAWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val database = (applicationContext as? PublicEyeApp)?.database 
            ?: return Result.failure()
        
        val complaintDao = database.complaintDao()
        val unresolved = complaintDao.getUnresolvedComplaints()
        val now = System.currentTimeMillis()

        for (complaint in unresolved) {
            val timeLeft = complaint.slaDeadline - now
            val totalTime = when (complaint.severityLevel) {
                "HIGH" -> SLAConfig.HIGH_SEVERITY_MS
                "LOW" -> SLAConfig.LOW_SEVERITY_MS
                else -> SLAConfig.MEDIUM_SEVERITY_MS
            }
            
            val ratio = timeLeft.toFloat() / totalTime.toFloat()

            var updatedStatus = complaint.slaStatus
            if (timeLeft < 0L) {
                updatedStatus = "BREACHED"
                sendNotification("⚠️ SLA Breached: Complaint #${complaint.id} is overdue!")
            } else if (ratio < 0.2f && complaint.slaStatus != "AT_RISK") {
                updatedStatus = "AT_RISK"
                sendNotification("⚠️ SLA Warning: Complaint #${complaint.id} is at risk of breach.")
            }

            if (updatedStatus != complaint.slaStatus) {
                complaintDao.updateComplaint(complaint.copy(slaStatus = updatedStatus))
            }
        }

        return Result.success()
    }

    private fun sendNotification(message: String) {
        val notificationManager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "SLA_ALERTS"
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "SLA Alerts", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(applicationContext, channelId)
            .setSmallIcon(R.drawable.ic_alert_circle)
            .setContentTitle("PublicEye Alert")
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}
