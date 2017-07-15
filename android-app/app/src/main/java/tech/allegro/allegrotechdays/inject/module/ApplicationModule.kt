package tech.allegro.allegrotechdays.inject.module

import com.google.gson.GsonBuilder
import dagger.Module
import dagger.Provides
import tech.allegro.allegrotechdays.TechDaysApp
import tech.allegro.allegrotechdays.inject.scope.ApplicationScope

@Module
class ApplicationModule(val application: TechDaysApp) {

    @Provides
    @ApplicationScope
    fun provideGson() = GsonBuilder().create()
}
