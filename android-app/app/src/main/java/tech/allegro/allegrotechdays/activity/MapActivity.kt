package tech.allegro.allegrotechdays.activity

import android.os.Bundle
import android.support.design.widget.FloatingActionButton
import android.support.v7.app.AppCompatActivity
import android.widget.FrameLayout
import tech.allegro.allegrotechdays.R
import tech.allegro.allegrotechdays.extensions.bindView

class MapActivity : AppCompatActivity() {

    val addReportButton: FloatingActionButton by bindView(R.id.map_fab_add_report)
    val fragmentHolder: FrameLayout by bindView(R.id.map_fragment_holder)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)
    }
}
