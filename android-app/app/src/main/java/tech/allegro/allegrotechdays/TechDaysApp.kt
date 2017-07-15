package tech.allegro.allegrotechdays

import android.app.Application
import tech.allegro.allegrotechdays.inject.component.ApplicationComponent
import tech.allegro.allegrotechdays.inject.component.DaggerApplicationComponent
import tech.allegro.allegrotechdays.inject.module.ApplicationModule

class TechDaysApp: Application() {

    val applicationComponent: ApplicationComponent by lazy {
        DaggerApplicationComponent
                .builder()
                .applicationModule(ApplicationModule(this))
                .build()
    }
}
