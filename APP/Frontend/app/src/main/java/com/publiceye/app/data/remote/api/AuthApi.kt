package com.publiceye.app.data.remote.api

import com.publiceye.app.data.models.*
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/send-otp")
    suspend fun sendOtp(@Body req: PhoneRequest): Response<StatusResponse>

    @POST("auth/verify-otp")
    suspend fun verifyOtp(@Body req: OtpRequest): Response<TokenResponse>

    @POST("auth/register")
    suspend fun register(@Body req: UserRegisterRequest): Response<TokenResponse>

    @POST("auth/login")
    suspend fun login(@Body req: UserLoginRequest): Response<TokenResponse>

    @POST("auth/logout")
    suspend fun logout(): Response<StatusResponse>
}
