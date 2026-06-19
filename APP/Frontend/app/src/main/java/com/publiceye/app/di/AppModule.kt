package com.publiceye.app.di

import com.publiceye.app.util.TranslationManager
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    @Provides
    @Singleton
    fun provideTranslationManager(): TranslationManager {
        return TranslationManager()
    }
}
