package tech.allegro.allegrotechdays.extensions

import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers

object Observables {

    inline fun <T> Observable<T>.subscribeAndObserve(): Observable<T> {
        return this
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
    }
}