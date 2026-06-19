package com.publiceye.app.data.remote.api

import com.publiceye.app.data.models.NotificationResponse
import com.publiceye.app.data.models.StatusResponse
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.Path

interface NotificationApi {
    @GET("notifications/")
    suspend fun getNotifications(): Response<List<NotificationResponse>>

    @PUT("notifications/{id}/read")
    suspend fun markAsRead(
        @Path("id") id: String
    ): Response<StatusResponse>
}
