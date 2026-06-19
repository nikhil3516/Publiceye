package com.publiceye.app.presentation.complaints.track

import androidx.lifecycle.ViewModel
import com.publiceye.app.data.repository.ComplaintRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class TrackViewModel @Inject constructor(
    private val repository: ComplaintRepository
) : ViewModel() {
    val allComplaints = repository.getAllComplaints()
}
