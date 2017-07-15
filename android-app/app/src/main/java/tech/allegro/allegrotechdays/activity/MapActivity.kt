package tech.allegro.allegrotechdays.activity

import android.os.Bundle
import android.support.design.widget.FloatingActionButton
import android.widget.FrameLayout
import tech.allegro.allegrotechdays.R
import tech.allegro.allegrotechdays.extensions.bindView
import tech.allegro.allegrotechdays.inject.component.ApplicationComponent

class MapActivity : InjectableBaseActivity<ApplicationComponent>() {

    val addReportButton: FloatingActionButton by bindView(R.id.map_fab_add_report)
    val fragmentHolder: FrameLayout by bindView(R.id.map_fragment_holder)

    override val component: ApplicationComponent
        get() = app.applicationComponent

    override fun inject(component: ApplicationComponent) {
        component.inject(this)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)
    }
}
