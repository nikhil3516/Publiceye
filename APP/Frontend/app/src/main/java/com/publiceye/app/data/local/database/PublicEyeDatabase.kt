package com.publiceye.app.data.local.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.publiceye.app.data.local.entities.UserEntity
import com.publiceye.app.data.local.entities.ComplaintEntity
import com.publiceye.app.data.local.dao.ComplaintDao

@Database(
    entities = [UserEntity::class, ComplaintEntity::class],
    version = 2,
    exportSchema = false
)
abstract class PublicEyeDatabase : RoomDatabase() {
    abstract fun complaintDao(): ComplaintDao
}
