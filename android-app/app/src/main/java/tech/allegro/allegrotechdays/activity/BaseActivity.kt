package tech.allegro.allegrotechdays.activity

import android.support.v7.app.AppCompatActivity
import tech.allegro.allegrotechdays.TechDaysApp

abstract class BaseActivity: AppCompatActivity() {

    val AppCompatActivity.app: TechDaysApp
        get() = application as TechDaysApp
}
