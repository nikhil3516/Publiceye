package com.publiceye.app.data.models

import kotlinx.serialization.Serializable

@Serializable
data class SupabaseUser(
    val id: String,
    val full_name: String,
    val email: String,
    val phone: String,
    val ward: String,
    val city: String,
    val created_at: Long
)
