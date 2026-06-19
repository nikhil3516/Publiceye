package com.publiceye.app.presentation.complaints.track

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class TrackComplaintViewModel @Inject constructor() : ViewModel() {
    private val _state = MutableStateFlow(TrackComplaintState(
        updates = listOf(
            TrackUpdate("Status updated", "Just now"),
            TrackUpdate("Officer John assigned", "2 mins ago"),
            TrackUpdate("Work started", "15 mins ago")
        )
    ))
    val state = _state.asStateFlow()

    fun refresh() {
        // Logic to refresh updates
    }
}
