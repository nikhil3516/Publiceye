package com.publiceye.app.presentation.home

data class HomeState(
    val userName: String = "Active Citizen",
    val greeting: String = "Good Morning",
    val isLoading: Boolean = false,
    val error: String? = null
)
