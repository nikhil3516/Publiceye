package com.publiceye.app.data.remote.api

import android.content.Context
import com.publiceye.app.utils.Constants
import com.publiceye.app.utils.TokenManager
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    
    private fun createOkHttpClient(context: Context): OkHttpClient {
        val tokenManager = TokenManager(context)
        
        val authInterceptor = Interceptor { chain ->
            val originalRequest = chain.request()
            val token = tokenManager.getToken()
            
            val requestBuilder = originalRequest.newBuilder()
            if (!token.isNullOrEmpty()) {
                requestBuilder.header("Authorization", "Bearer $token")
            }
            
            chain.proceed(requestBuilder.build())
        }

        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    private var retrofit: Retrofit? = null

    fun getRetrofit(context: Context): Retrofit {
        if (retrofit == null) {
            retrofit = Retrofit.Builder()
                .baseUrl(Constants.BASE_URL)
                .client(createOkHttpClient(context))
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        }
        return retrofit!!
    }

    fun getAuthApi(context: Context): AuthApi = getRetrofit(context).create(AuthApi::class.java)
    fun getComplaintApi(context: Context): ComplaintApi = getRetrofit(context).create(ComplaintApi::class.java)
    fun getUserApi(context: Context): UserApi = getRetrofit(context).create(UserApi::class.java)
    fun getNotificationApi(context: Context): NotificationApi = getRetrofit(context).create(NotificationApi::class.java)
}
