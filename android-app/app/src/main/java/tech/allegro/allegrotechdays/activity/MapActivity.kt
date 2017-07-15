package tech.allegro.allegrotechdays.activity

import android.os.Bundle
import android.support.design.widget.FloatingActionButton
import android.widget.FrameLayout
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import tech.allegro.allegrotechdays.R
import tech.allegro.allegrotechdays.extensions.bindView
import tech.allegro.allegrotechdays.inject.component.ApplicationComponent

class MapActivity : InjectableBaseActivity<ApplicationComponent>(), OnMapReadyCallback {

    val addReportButton: FloatingActionButton by bindView(R.id.map_fab_add_report)
    val fragmentHolder: FrameLayout by bindView(R.id.map_fragment_holder)

    private lateinit var googleMap: GoogleMap

    override val component: ApplicationComponent
        get() = app.applicationComponent

    override fun inject(component: ApplicationComponent) {
        component.inject(this)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)

        val mapFragment = supportFragmentManager
                .findFragmentById(R.id.map_fragment_map) as SupportMapFragment
        mapFragment.getMapAsync(this)
    }

    override fun onMapReady(googleMap: GoogleMap) {
        this.googleMap = googleMap

        val ezoterycznyPoznan = LatLng(52.406374, 16.925168)
        this.googleMap.addMarker(MarkerOptions().position(ezoterycznyPoznan).title("Ezoteryczny Poznań"))
        this.googleMap.moveCamera(CameraUpdateFactory.newLatLng(ezoterycznyPoznan))
    }
}
