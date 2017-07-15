package tech.allegro.allegrotechdays.inject.component

import dagger.Component
import tech.allegro.allegrotechdays.activity.MapActivity
import tech.allegro.allegrotechdays.inject.module.ApplicationModule
import tech.allegro.allegrotechdays.inject.module.NetworkModule
import tech.allegro.allegrotechdays.inject.scope.ApplicationScope

@ApplicationScope
@Component(modules = arrayOf(ApplicationModule::class, NetworkModule::class))
interface ApplicationComponent {

    fun inject(activity: MapActivity)
}