package tech.allegro.allegrotechdays.activity

import android.os.Bundle
import android.os.PersistableBundle
import tech.allegro.allegrotechdays.inject.Injectable

abstract class InjectableBaseActivity<T> : BaseActivity(), Injectable<T> {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        inject(component)
    }

    override fun onCreate(savedInstanceState: Bundle?, persistentState: PersistableBundle?) {
        super.onCreate(savedInstanceState, persistentState)
        inject(component)
    }
}
