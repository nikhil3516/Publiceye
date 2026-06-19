package com.publiceye.app.data.remote.api

import com.publiceye.app.data.models.FcmTokenRequest
import com.publiceye.app.data.models.StatusResponse
import com.publiceye.app.data.models.UpdateProfileRequest
import com.publiceye.app.data.models.UserModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PUT

interface UserApi {
    @GET("users/me")
    suspend fun getProfile(): Response<UserModel>

    @PUT("users/me")
    suspend fun updateProfile(
        @Body req: UpdateProfileRequest
    ): Response<UserModel>

    @PUT("users/me/fcm-token")
    suspend fun updateFcmToken(
        @Body req: FcmTokenRequest
    ): Response<StatusResponse>
}
