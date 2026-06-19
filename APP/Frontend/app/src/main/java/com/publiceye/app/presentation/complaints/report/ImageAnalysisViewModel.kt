package com.publiceye.app.presentation.complaints.report

import android.graphics.Bitmap
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import com.publiceye.app.BuildConfig
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

enum class SeverityLevel { HIGH, MEDIUM, LOW }

data class SeverityResult(
    val level: SeverityLevel = SeverityLevel.MEDIUM,
    val reason: String = "",
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class ImageAnalysisViewModel @Inject constructor() : ViewModel() {

    private val _severityResult = MutableStateFlow(SeverityResult())
    val severityResult: StateFlow<SeverityResult> = _severityResult

    private val generativeModel by lazy {
        GenerativeModel(
            modelName = "gemini-1.5-flash",
            apiKey = BuildConfig.GEMINI_API_KEY
        )
    }

    fun analyzeImage(bitmap: Bitmap) {
        _severityResult.value = SeverityResult(isLoading = true)

        viewModelScope.launch {
            try {
                val inputContent = content {
                    image(bitmap)
                    text("You are a civic complaint analyzer. Analyze this image and determine the severity of the civic issue shown. " +
                            "- HIGH: Immediate danger, road cave-in, flooding, fallen electric pole, open manhole, large fire hazard. Respond with: SEVERITY:HIGH " +
                            "- MEDIUM: Significant but not immediately dangerous — garbage pile, broken road, waterlogging, damaged footpath. Respond with: SEVERITY:MEDIUM " +
                            "- LOW: Minor cosmetic issues — faded paint, small pothole, broken streetlight. Respond with: SEVERITY:LOW " +
                            "Also provide a one-line reason. Format: SEVERITY:HIGH|REASON:your reason here")
                }

                val response = generativeModel.generateContent(inputContent)
                val responseText = response.text ?: ""
                
                parseResponse(responseText)
            } catch (e: Exception) {
                _severityResult.value = SeverityResult(
                    level = SeverityLevel.MEDIUM,
                    reason = "AI analysis unavailable. Default severity applied.",
                    error = e.message
                )
            }
        }
    }

    private fun parseResponse(response: String) {
        try {
            val parts = response.split("|")
            val severityPart = parts.getOrNull(0)?.substringAfter("SEVERITY:")?.trim() ?: "MEDIUM"
            val reasonPart = parts.getOrNull(1)?.substringAfter("REASON:")?.trim() ?: "Analyzed by AI"

            val level = when (severityPart.uppercase()) {
                "HIGH" -> SeverityLevel.HIGH
                "LOW" -> SeverityLevel.LOW
                else -> SeverityLevel.MEDIUM
            }

            _severityResult.value = SeverityResult(level = level, reason = reasonPart)
        } catch (e: Exception) {
            _severityResult.value = SeverityResult(level = SeverityLevel.MEDIUM, reason = "Default severity applied.")
        }
    }
    
    fun setSeverityManually(level: SeverityLevel) {
        _severityResult.value = _severityResult.value.copy(level = level, reason = "Set manually by user")
    }
}
