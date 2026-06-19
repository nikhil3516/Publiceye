package com.publiceye.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "complaints")
data class ComplaintEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val imageUri: String?,
    val severityLevel: String,      // HIGH, MEDIUM, LOW
    val status: String,             // SUBMITTED, UNDER_REVIEW, ASSIGNED, IN_PROGRESS, RESOLVED
    val submittedAt: Long,
    val slaDeadline: Long,
    val slaStatus: String,          // ON_TRACK, AT_RISK, BREACHED
    val resolvedAt: Long? = null,
    val aiReason: String? = null
)
