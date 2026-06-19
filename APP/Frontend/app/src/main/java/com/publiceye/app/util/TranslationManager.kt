package com.publiceye.app.util

import androidx.compose.runtime.*

enum class LanguageCode(val code: String, val label: String) {
    EN("en", "EN"),
    TE("te", "తె"),
    TA("ta", "த"),
    HI("hi", "हिं"),
    KN("kn", "ಕ"),
    ML("ml", "മ")
}

@Stable
class TranslationManager(initialLanguage: LanguageCode = LanguageCode.EN) {
    var currentLanguage by mutableStateOf(initialLanguage)

    fun t(key: String): String {
        return translations[currentLanguage]?.get(key) ?: translations[LanguageCode.EN]?.get(key) ?: key
    }

    private val translations = mapOf(
        LanguageCode.EN to mapOf(
            "home.publicEye" to "PublicEye",
            "home.yourVoiceMatters" to "Your Voice Matters",
            "home.joinToMake" to "Join To Make",
            "home.yourCityBetter" to "Your City Better",
            "home.activeCitizen" to "Active Citizen",
            "nav.home" to "Home",
            "nav.notifications" to "Notifications",
            "nav.complaints" to "Complaints",
            "nav.profile" to "Profile",
            "profile.checkNotifications" to "Check Notifications",
            "profile.changeLanguage" to "Change Language",
            "profile.ratePlaystore" to "Rate Playstore",
            "profile.reportIssue" to "Report Issue",
            "profile.privacyPolicy" to "Privacy Policy",
            "profile.whatsNew" to "What's New",
            "language.select" to "Select Language",
            "language.ministryHindi" to "आवास और शहरी कार्य मंत्रालय",
            "language.ministryEnglish" to "Ministry of Housing and Urban Affairs"
        ),
        LanguageCode.HI to mapOf(
            "home.publicEye" to "PublicEye",
            "home.yourVoiceMatters" to "आपकी आवाज़ मायने रखती है",
            "home.joinToMake" to "शामिल हों बनाने के लिए",
            "home.yourCityBetter" to "आपका शहर बेहतर",
            "home.activeCitizen" to "सक्रिय नागरिक",
            "nav.home" to "मुख्य",
            "nav.notifications" to "सूचनाएं",
            "nav.complaints" to "शिकायतें",
            "nav.profile" to "प्रोफ़ाइल",
            "profile.checkNotifications" to "सूचनाएं जांचें",
            "profile.changeLanguage" to "भाषा बदलें",
            "language.select" to "भाषा चुनें"
        )
        // Add other languages as needed
    )
}

val LocalTranslation = staticCompositionLocalOf { TranslationManager() }
