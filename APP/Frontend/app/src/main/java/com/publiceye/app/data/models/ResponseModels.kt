package com.publiceye.app.data.models

import kotlinx.serialization.Serializable

@Serializable
data class PhoneRequest(
    val phone: String
)

@Serializable
data class OtpRequest(
    val phone: String,
    val otp: String
)

@Serializable
data class TokenResponse(
    val access_token: String,
    val token_type: String,
    val user: UserModel
)

@Serializable
data class UserModel(
    val id: String,
    val phone: String,
    val name: String?,
    val email: String?,
    val location: String?
)

@Serializable
data class ComplaintModel(
    val id: String,
    val title: String,
    val description: String,
    val category: String,
    val status: String,
    val image_url: String?,
    val lat: Double,
    val lng: Double,
    val city: String,
    val address: String?,
    val vote_count: Int,
    val created_at: String
)

@Serializable
data class VoteResponse(
    val voted: Boolean,
    val vote_count: Int
)

@Serializable
data class StatusResponse(
    val status: String,
    val message: String?
)

@Serializable
data class UpdateProfileRequest(
    val name: String?,
    val email: String?,
    val location: String?
)

@Serializable
data class FcmTokenRequest(
    val fcm_token: String
)

// Email/Password models to bridge existing auth screens to the backend
@Serializable
data class UserRegisterRequest(
    val fullName: String,
    val email: String,
    val phone: String,
    val password: String,
    val ward: String,
    val city: String
)

@Serializable
data class UserLoginRequest(
    val email: String,
    val password: String
)

@Serializable
data class NotificationResponse(
    val id: String,
    val title: String,
    val message: String,
    val is_read: Boolean,
    val created_at: String
)

@Serializable
data class NotificationSendRequest(
    val fcm_token: String,
    val title: String,
    val message: String
)
