package com.publiceye.app.data.remote.api

import com.publiceye.app.data.models.ComplaintModel
import com.publiceye.app.data.models.VoteResponse
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.*

interface ComplaintApi {
    @GET("complaints/")
    suspend fun getComplaints(
        @Query("page") page: Int,
        @Query("limit") limit: Int,
        @Query("category") category: String?,
        @Query("status") status: String?
    ): Response<List<ComplaintModel>>

    @GET("complaints/nearby")
    suspend fun getNearby(
        @Query("lat") lat: Double,
        @Query("lng") lng: Double,
        @Query("radius_km") radiusKm: Double
    ): Response<List<ComplaintModel>>

    @GET("complaints/city")
    suspend fun getCityComplaints(
        @Query("city") city: String
    ): Response<List<ComplaintModel>>

    @GET("complaints/my")
    suspend fun getMyComplaints(): Response<List<ComplaintModel>>

    @GET("complaints/voted")
    suspend fun getVotedComplaints(): Response<List<ComplaintModel>>

    @Multipart
    @POST("complaints/")
    suspend fun postComplaint(
        @Part("title") title: RequestBody,
        @Part("description") description: RequestBody,
        @Part("category") category: RequestBody,
        @Part("lat") lat: RequestBody,
        @Part("lng") lng: RequestBody,
        @Part("city") city: RequestBody,
        @Part("address") address: RequestBody,
        @Part image: MultipartBody.Part?
    ): Response<ComplaintModel>

    @POST("complaints/{id}/vote")
    suspend fun voteComplaint(
        @Path("id") id: String
    ): Response<VoteResponse>
}
