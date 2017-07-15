package tech.allegro.allegrotechdays.inject

interface Injectable<T> {

    val component: T

    fun inject(component: T)
}
