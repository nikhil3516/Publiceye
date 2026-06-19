package com.publiceye.app.presentation.complaints.track

data class TrackUpdate(
    val title: String,
    val timestamp: String
)

data class TrackComplaintState(
    val updates: List<TrackUpdate> = emptyList(),
    val isLoading: Boolean = false
)
