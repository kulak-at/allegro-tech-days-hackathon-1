package tech.allegro.allegrotechdays.activity

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.ObjectAnimator
import android.os.Bundle
import android.support.design.widget.FloatingActionButton
import android.util.Log
import android.view.View
import android.view.ViewAnimationUtils
import android.widget.*
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.api.GoogleApiClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.places.Places
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import io.reactivex.rxkotlin.subscribeBy
import tech.allegro.allegrotechdays.R
import tech.allegro.allegrotechdays.extensions.Observables.subscribeAndObserve
import tech.allegro.allegrotechdays.extensions.bindView
import tech.allegro.allegrotechdays.inject.component.ApplicationComponent
import tech.allegro.allegrotechdays.model.UserReport
import tech.allegro.allegrotechdays.network.TechDaysApi
import javax.inject.Inject

class MapActivity : InjectableBaseActivity<ApplicationComponent>(), OnMapReadyCallback,
        GoogleApiClient.OnConnectionFailedListener, GoogleApiClient.ConnectionCallbacks {

    val locationMarker: ImageView by bindView(R.id.map_location_marker)
    val bottomView: View by bindView(R.id.map_bottom_view)

    val addReportButton: FloatingActionButton by bindView(R.id.map_fab_add_report)
    val addReportProgress: ProgressBar by bindView(R.id.map_fab_progress_bar)
    val reportDescription: EditText by bindView(R.id.map_report_description)
    val reportRadioGroup: RadioGroup by bindView(R.id.map_report_radio_group)

    @Inject lateinit var techDaysApi: TechDaysApi

    private lateinit var googleApiClient: GoogleApiClient
    private lateinit var googleMap: GoogleMap

    private val markerAnimationDuration = 150L
    private val markerAnimationOffset = 30f

    private var isReportPanelShowing = false

    private val ezoterycznyPoznań = LatLng(52.406374, 16.925168)

    override val component: ApplicationComponent
        get() = app.applicationComponent

    override fun inject(component: ApplicationComponent) {
        component.inject(this)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)

        addReportButton.setOnClickListener {
            if (isReportPanelShowing) {
                techDaysApi.sendUserReport(createUserReport())
                        .subscribeAndObserve()
                        .doOnSubscribe { addReportButton.showProgress() }
                        .doOnTerminate { addReportButton.hideProgress() }
                        .subscribeBy (
                            onNext = { startCircularRevealAnimation(!isReportPanelShowing) },
                            onError = { Log.e("stuff", it.message) }
                        )
            } else {
                startCircularRevealAnimation(!isReportPanelShowing)
            }
        }

        initGoogleApiClient()
    }

    override fun onBackPressed() {
        if (isReportPanelShowing) {
            startCircularRevealAnimation(!isReportPanelShowing)
        } else {
            super.onBackPressed()
        }
    }

    override fun onConnected(connectionHint: Bundle?) {
        val mapFragment = supportFragmentManager
                .findFragmentById(R.id.map_fragment_map) as SupportMapFragment
        mapFragment.getMapAsync(this)
    }

    override fun onConnectionSuspended(cause: Int) { }

    override fun onConnectionFailed(result: ConnectionResult) { }

    override fun onMapReady(map: GoogleMap) {
        googleMap = map
        googleMap.setMyLocationEnabled(true)
        googleMap.getUiSettings().setMyLocationButtonEnabled(true)

        googleMap.setOnCameraMoveStartedListener {
            locationMarker.animateUp()
        }

        googleMap.setOnCameraIdleListener {
            locationMarker.animateDown()
        }
    }

    private fun initGoogleApiClient() {
        googleApiClient = GoogleApiClient.Builder(this)
                .enableAutoManage(this, this)
                .addConnectionCallbacks(this)
                .addApi(LocationServices.API)
                .addApi(Places.GEO_DATA_API)
                .addApi(Places.PLACE_DETECTION_API)
                .build()

        googleApiClient.connect()
    }

    private fun calculateRevealAnimationCenter(): Pair<Int, Int> {
        val fabMargin = resources.getDimension(R.dimen.fab_add_report_margin)
        val fabSize = resources.getDimension(R.dimen.fab_add_report_size)

        val x = (bottomView.width - (fabMargin + (fabSize / 2))).toInt()
        val y = (bottomView.height - (fabMargin + (fabSize / 2))).toInt()

        return Pair(x, y)
    }

    private fun startCircularRevealAnimation(enter: Boolean) {
        val animCenter = calculateRevealAnimationCenter()
        val radius = Math.hypot(animCenter.first.toDouble(), animCenter.second.toDouble()).toFloat()

        val anim = if (enter) {
            ViewAnimationUtils.createCircularReveal(bottomView, animCenter.first, animCenter.second, 0f, radius)
        } else {
            ViewAnimationUtils.createCircularReveal(bottomView, animCenter.first, animCenter.second, radius, 0f)
        }

        anim.addListener(object : AnimatorListenerAdapter() {
            override fun onAnimationEnd(animation: Animator?) {
                super.onAnimationEnd(animation)

                if (enter) {
                    isReportPanelShowing = true
                    addReportButton.setImageDrawable(resources.getDrawable(R.drawable.ic_check))
                } else {
                    addReportButton.setImageDrawable(resources.getDrawable(R.drawable.ic_add_location))
                    bottomView.visibility = View.INVISIBLE
                    isReportPanelShowing = false
                }
            }
        })

        if (enter) {
            bottomView.visibility = View.VISIBLE
        }

        anim.start()
    }

    private fun createUserReport(): UserReport {
        val location = googleMap.cameraPosition.target
        val desc = reportDescription.text.toString()
        var reason: String = ""
        val checkedRadioButton = findViewById(reportRadioGroup.checkedRadioButtonId)

        if (checkedRadioButton != null) {
            reason = (checkedRadioButton as RadioButton).text.toString()
        }

        return UserReport(location.longitude, location.latitude, reason, desc)
    }

    private fun ImageView.animateDown() {
        val animation = ObjectAnimator.ofFloat(locationMarker, "translationY", markerAnimationOffset)
        animation.duration = markerAnimationDuration
        animation.start()
    }

    private fun ImageView.animateUp() {
        val animation = ObjectAnimator.ofFloat(this, "translationY", -markerAnimationOffset)
        animation.duration = markerAnimationDuration
        animation.start()
    }

    private fun FloatingActionButton.showProgress() {
        this.post {
            addReportProgress.visibility = View.VISIBLE
            this.setImageDrawable(null)
            this.isClickable = false
        }
    }

    private fun FloatingActionButton.hideProgress() {
        this.post {
            addReportProgress.visibility = View.INVISIBLE
            this.setImageDrawable(resources.getDrawable(R.drawable.ic_check))
            this.isClickable = true
        }
    }
}
