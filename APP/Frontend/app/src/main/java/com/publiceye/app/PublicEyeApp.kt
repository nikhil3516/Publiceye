package com.publiceye.app

import android.app.Application
import android.content.Context
import androidx.room.Room
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.publiceye.app.data.local.database.PublicEyeDatabase
import com.publiceye.app.service.SLAWorker
import com.publiceye.app.util.LocaleHelper
import dagger.hilt.android.HiltAndroidApp
import java.util.concurrent.TimeUnit

@HiltAndroidApp
class PublicEyeApp : Application() {
    
    lateinit var database: PublicEyeDatabase
        private set

    override fun attachBaseContext(base: Context) {
        super.attachBaseContext(LocaleHelper.onAttach(base))
    }

    override fun onCreate() {
        super.onCreate()
        database = Room.databaseBuilder(
            this,
            PublicEyeDatabase::class.java,
            "publiceye_db"
        ).fallbackToDestructiveMigration().build()
        
        setupSLAWorker()
    }

    private fun setupSLAWorker() {
        val slaWorkRequest = PeriodicWorkRequestBuilder<SLAWorker>(1, TimeUnit.HOURS)
            .build()
        WorkManager.getInstance(this).enqueue(slaWorkRequest)
    }
}
