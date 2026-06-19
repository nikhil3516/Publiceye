package com.publiceye.app.utils

object Constants {
    // Change this to false for production
    private const val IS_DEBUG = true
    
    /**
     * CONNECTION GUIDE:
     * Your computer's Wi-Fi IP is: 192.168.167.81
     */
    private const val SERVER_IP = "192.168.167.81"
    private const val PORT = "8000"

    val BASE_URL = if (IS_DEBUG) {
        "http://$SERVER_IP:$PORT/"
    } else {
        "https://api.publiceye.gov.in/v1/"
    }

    // Supabase Configuration
    const val SUPABASE_URL = "https://pqxusfbsfacqgpvrrrlo.supabase.co"
    const val SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxeHVzZmJzZmFjcWdwdnJycmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzOTE0NDgsImV4cCI6MjA5NTk2NzQ0OH0.XB1b6XslE72M4NmLIsTMRtfGaigL-o-UubLxAF1JmUU"

    const val DATABASE_NAME = "public_eye_db"
}
