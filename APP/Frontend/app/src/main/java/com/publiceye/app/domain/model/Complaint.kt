package com.publiceye.app.domain.model

import androidx.annotation.StringRes
import androidx.annotation.DrawableRes
import androidx.compose.ui.graphics.Color
import com.publiceye.app.R

data class Complaint(
    val id: String,
    val userId: String,
    val category: ComplaintCategory,
    val title: String,
    val description: String,
    val location: Location,
    val address: String,
    val ward: String,
    val city: String,
    val images: List<String>,
    val status: ComplaintStatus,
    val priority: Priority,
    val submittedDate: Long,
    val lastUpdated: Long,
    val resolvedDate: Long?,
    val upvotes: Int = 0,
    val hasVoted: Boolean = false,
    val assignedTo: String?,
    val adminNotes: String?
)

data class Location(
    val latitude: Double,
    val longitude: Double
)

enum class Priority {
    LOW, MEDIUM, HIGH, URGENT
}

enum class ComplaintCategory(
    @StringRes val titleRes: Int,
    @DrawableRes val iconRes: Int,
    val color: Color
) {
    WATER_SEWAGE(R.string.water_sewage, R.drawable.ic_droplet, Color(0xFF3B82F6)),
    ROADS_FOOTPATHS(R.string.roads_footpaths, R.drawable.ic_road, Color(0xFFF59E0B)),
    GARBAGE_CLEANING(R.string.garbage_cleaning, R.drawable.ic_trash, Color(0xFF22C55E)),
    STREET_LIGHTS(R.string.street_lights, R.drawable.ic_lightbulb, Color(0xFFFBBF24)),
    PARKS_PLAYGROUNDS(R.string.parks_playgrounds, R.drawable.ic_tree, Color(0xFF10B981)),
    TRAFFIC_PARKING(R.string.traffic_parking, R.drawable.ic_car, Color(0xFF6366F1)),
    STRAY_ANIMALS(R.string.stray_animals, R.drawable.ic_dog, Color(0xFFEC4899)),
    DRAINAGE(R.string.drainage, R.drawable.ic_water_drop, Color(0xFF14B8A6)),
    PUBLIC_TOILETS(R.string.public_toilets, R.drawable.ic_building, Color(0xFF8B5CF6)),
    ELECTRICITY(R.string.electricity, R.drawable.ic_zap, Color(0xFFF59E0B)),
    NOISE_POLLUTION(R.string.noise_pollution, R.drawable.ic_volume, Color(0xFFEF4444)),
    ILLEGAL_CONSTRUCTION(R.string.illegal_construction, R.drawable.ic_alert, Color(0xFFDC2626)),
    OTHER(R.string.other, R.drawable.ic_circle_ellipsis, Color(0xFF64748B))
}

enum class ComplaintStatus(
    @StringRes val labelRes: Int,
    val color: Color
) {
    SUBMITTED(R.string.status_submitted, Color(0xFF3B82F6)),
    UNDER_REVIEW(R.string.status_under_review, Color(0xFFFBBF24)),
    ASSIGNED(R.string.status_assigned, Color(0xFF8B5CF6)),
    IN_PROGRESS(R.string.status_in_progress, Color(0xFF3B82F6)),
    RESOLVED(R.string.status_resolved, Color(0xFF22C55E)),
    REJECTED(R.string.status_rejected, Color(0xFFEF4444)),
    CLOSED(R.string.status_closed, Color(0xFF64748B))
}
