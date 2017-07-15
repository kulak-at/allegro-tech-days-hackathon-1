package tech.allegro.allegrotechdays.inject.module

import com.google.gson.Gson
import dagger.Module
import dagger.Provides
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory
import tech.allegro.allegrotechdays.BuildConfig
import tech.allegro.allegrotechdays.inject.scope.ApplicationScope
import tech.allegro.allegrotechdays.network.TechDaysApi

@ApplicationScope
@Module
class NetworkModule {

    @ApplicationScope
    @Provides
    fun provideHttpClient(gson: Gson): OkHttpClient {
        val clientBuilder = OkHttpClient.Builder()

        val logInterceptor = HttpLoggingInterceptor()
        logInterceptor.level = HttpLoggingInterceptor.Level.BODY
        clientBuilder.addInterceptor(logInterceptor)

        return clientBuilder.build()
    }

    @ApplicationScope
    @Provides
    fun provideRetrofit(gson: Gson, httpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
                .baseUrl(BuildConfig.apiEndpointUrl)
                .client(httpClient)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .build()
    }

    @ApplicationScope
    @Provides
    fun provideRetrofitApi(retrofit: Retrofit) = retrofit.create(TechDaysApi::class.java)
}
