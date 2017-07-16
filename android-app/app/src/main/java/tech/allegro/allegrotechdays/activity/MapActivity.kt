package tech.allegro.allegrotechdays.activity

import android.os.Bundle
import android.support.design.widget.FloatingActionButton
import android.widget.FrameLayout
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.api.GoogleApiClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.places.Places
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import tech.allegro.allegrotechdays.R
import tech.allegro.allegrotechdays.extensions.bindView
import tech.allegro.allegrotechdays.inject.component.ApplicationComponent


class MapActivity : InjectableBaseActivity<ApplicationComponent>(), OnMapReadyCallback,
        GoogleApiClient.OnConnectionFailedListener, GoogleApiClient.ConnectionCallbacks {

    val addReportButton: FloatingActionButton by bindView(R.id.map_fab_add_report)
    val fragmentHolder: FrameLayout by bindView(R.id.map_fragment_holder)

    private lateinit var googleApiClient: GoogleApiClient
    private lateinit var googleMap: GoogleMap

    override val component: ApplicationComponent
        get() = app.applicationComponent

    override fun inject(component: ApplicationComponent) {
        component.inject(this)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)

        googleApiClient = GoogleApiClient.Builder(this)
                .enableAutoManage(this, this)
                .addConnectionCallbacks(this)
                .addApi(LocationServices.API)
                .addApi(Places.GEO_DATA_API)
                .addApi(Places.PLACE_DETECTION_API)
                .build()

        googleApiClient.connect()
    }

    override fun onConnected(connectionHint: Bundle?) {
        val mapFragment = supportFragmentManager
                .findFragmentById(R.id.map_fragment_map) as SupportMapFragment
        mapFragment.getMapAsync(this)
    }

    override fun onConnectionSuspended(cause: Int) {

    }

    override fun onConnectionFailed(result: ConnectionResult) {

    }

    override fun onMapReady(map: GoogleMap) {
        googleMap = map

        googleMap.setMyLocationEnabled(true)
        googleMap.getUiSettings().setMyLocationButtonEnabled(true)

        val ezoterycznyPoznań = LatLng(52.406374, 16.925168)
        googleMap.addMarker(MarkerOptions().position(ezoterycznyPoznań).title("Ezoteryczny Poznań"))
        googleMap.moveCamera(CameraUpdateFactory.newLatLng(ezoterycznyPoznań))
    }
}
