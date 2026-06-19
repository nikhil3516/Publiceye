package com.publiceye.app.domain.model

data class Survey(
    val id: String,
    val title: String,
    val description: String,
    val questions: List<SurveyQuestion>,
    val expiryDate: Long,
    val rewardPoints: Int,
    val isActive: Boolean
)

data class SurveyQuestion(
    val id: String,
    val question: String,
    val type: QuestionType,
    val options: List<String>?,
    val required: Boolean
)

enum class QuestionType {
    SINGLE_CHOICE, MULTIPLE_CHOICE, TEXT, RATING
}
