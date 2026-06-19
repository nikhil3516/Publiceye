package com.publiceye.app.di

import android.content.Context
import com.publiceye.app.PublicEyeApp
import com.publiceye.app.data.local.dao.ComplaintDao
import com.publiceye.app.data.local.database.PublicEyeDatabase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): PublicEyeDatabase {
        return (context as PublicEyeApp).database
    }

    @Provides
    @Singleton
    fun provideComplaintDao(db: PublicEyeDatabase): ComplaintDao {
        return db.complaintDao()
    }
}
