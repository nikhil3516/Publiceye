package com.publiceye.app.data.repository

import com.publiceye.app.data.local.dao.ComplaintDao
import com.publiceye.app.data.local.entities.ComplaintEntity
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ComplaintRepository @Inject constructor(
    private val complaintDao: ComplaintDao
) {
    fun getAllComplaints() = complaintDao.getAllComplaints()

    suspend fun insertComplaint(complaint: ComplaintEntity) = complaintDao.insertComplaint(complaint)

    suspend fun getComplaintById(id: String) = complaintDao.getComplaintById(id)
}
