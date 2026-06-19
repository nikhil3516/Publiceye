package com.publiceye.app.presentation.complaints.report

import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.publiceye.app.data.local.entities.ComplaintEntity
import com.publiceye.app.data.repository.ComplaintRepository
import com.publiceye.app.util.SLAConfig
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.util.*
import javax.inject.Inject

@HiltViewModel
class SubmitComplaintViewModel @Inject constructor(
    private val repository: ComplaintRepository
) : ViewModel() {

    private val _submissionState = MutableStateFlow<SubmissionState>(SubmissionState.Idle)
    val submissionState: StateFlow<SubmissionState> = _submissionState

    fun submitComplaint(
        id: String,
        title: String,
        description: String,
        imageUri: Uri?,
        severity: String,
        address: String
    ) {
        viewModelScope.launch {
            _submissionState.value = SubmissionState.Loading
            
            val submittedAt = System.currentTimeMillis()
            val deadline = SLAConfig.getDeadline(submittedAt, severity)
            
            val entity = ComplaintEntity(
                id = id,
                title = title,
                description = description,
                imageUri = imageUri?.toString(),
                severityLevel = severity,
                status = "SUBMITTED",
                submittedAt = submittedAt,
                slaDeadline = deadline,
                slaStatus = "ON_TRACK",
                aiReason = "Analyzed by AI"
            )

            try {
                repository.insertComplaint(entity)
                // In real app, also call API here
                _submissionState.value = SubmissionState.Success
            } catch (e: Exception) {
                _submissionState.value = SubmissionState.Error(e.message ?: "Unknown error")
            }
        }
    }
}

sealed class SubmissionState {
    object Idle : SubmissionState()
    object Loading : SubmissionState()
    object Success : SubmissionState()
    data class Error(val message: String) : SubmissionState()
}
