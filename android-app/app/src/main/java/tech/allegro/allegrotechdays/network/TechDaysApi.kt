package tech.allegro.allegrotechdays.network

import io.reactivex.Observable
import okhttp3.ResponseBody
import retrofit2.http.Body
import retrofit2.http.POST
import tech.allegro.allegrotechdays.model.UserReport

interface TechDaysApi {

    @POST("user-report")
    fun sendUserReport(@Body report: UserReport): Observable<ResponseBody>
}