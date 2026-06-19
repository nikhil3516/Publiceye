package com.publiceye.app.data.remote.api

import retrofit2.http.GET

interface PublicEyeApi {
    // Basic health check or initial endpoint
    @GET("health")
    suspend fun checkHealth(): String
}
