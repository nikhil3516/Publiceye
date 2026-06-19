package com.publiceye.app.domain.model

data class User(
    val id: String,
    val name: String,
    val email: String?,
    val phone: String,
    val ward: String,
    val city: String,
    val state: String,
    val profileImage: String?,
    val totalComplaints: Int = 0,
    val resolvedComplaints: Int = 0,
    val points: Int = 0,
    val level: Int = 1,
    val joinedDate: Long,
    val language: String = "en"
)
