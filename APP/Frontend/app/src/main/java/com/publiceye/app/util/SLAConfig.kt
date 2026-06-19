package com.publiceye.app.util

object SLAConfig {
    // SLA durations in hours
    private const val HIGH_SEVERITY_HOURS = 48L
    private const val MEDIUM_SEVERITY_HOURS = 168L
    private const val LOW_SEVERITY_HOURS = 336L

    // SLA durations in milliseconds
    const val HIGH_SEVERITY_MS = HIGH_SEVERITY_HOURS * 60 * 60 * 1000
    const val MEDIUM_SEVERITY_MS = MEDIUM_SEVERITY_HOURS * 60 * 60 * 1000
    const val LOW_SEVERITY_MS = LOW_SEVERITY_HOURS * 60 * 60 * 1000

    fun getDeadline(submittedAt: Long, severity: String): Long {
        return when (severity.uppercase()) {
            "HIGH" -> submittedAt + HIGH_SEVERITY_MS
            "MEDIUM" -> submittedAt + MEDIUM_SEVERITY_MS
            "LOW" -> submittedAt + LOW_SEVERITY_MS
            else -> submittedAt + MEDIUM_SEVERITY_MS
        }
    }
}
