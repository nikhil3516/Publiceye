package com.publiceye.app.di

import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    // Example:
    // @Binds
    // @Singleton
    // abstract fun bindAuthRepository(impl: AuthRepositoryImpl): AuthRepository
}
