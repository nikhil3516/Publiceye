package com.publiceye.app.presentation.components

import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker

@Composable
fun OsmMapView(
    modifier: Modifier = Modifier,
    latitude: Double,
    longitude: Double,
    onLocationChanged: (Double, Double) -> Unit = { _, _ -> }
) {
    val context = LocalContext.current
    
    // Initialize OSMDroid configuration
    Configuration.getInstance().userAgentValue = context.packageName

    val mapView = remember {
        MapView(context).apply {
            setTileSource(TileSourceFactory.MAPNIK)
            setMultiTouchControls(true)
            controller.setZoom(15.0)
            controller.setCenter(GeoPoint(latitude, longitude))
            
            // Marker is added here in factory
            val marker = Marker(this)
            marker.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
            marker.title = "Complaint Location"
            overlays.add(marker)
        }
    }

    val lifecycleObserver = remember {
        LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_RESUME -> mapView.onResume()
                Lifecycle.Event.ON_PAUSE -> mapView.onPause()
                else -> {}
            }
        }
    }
    
    val lifecycle = LocalLifecycleOwner.current.lifecycle
    DisposableEffect(lifecycle) {
        lifecycle.addObserver(lifecycleObserver)
        onDispose {
            lifecycle.removeObserver(lifecycleObserver)
        }
    }

    AndroidView(
        modifier = modifier,
        factory = { mapView },
        update = { view ->
            val point = GeoPoint(latitude, longitude)
            
            // Update marker position instead of recreating overlays
            val marker = view.overlays.filterIsInstance<Marker>().firstOrNull()
            marker?.position = point
            
            // Animate to point if it's far from center (e.g. current location FAB pressed)
            val currentCenter = view.mapCenter as GeoPoint
            if (currentCenter.distanceToAsDouble(point) > 10.0) {
                view.controller.animateTo(point)
            }
            
            view.setMapListener(object : org.osmdroid.events.MapListener {
                override fun onScroll(event: org.osmdroid.events.ScrollEvent?): Boolean {
                    val center = view.mapCenter as GeoPoint
                    onLocationChanged(center.latitude, center.longitude)
                    // Move marker to new center while scrolling
                    marker?.position = center
                    return true
                }
                override fun onZoom(event: org.osmdroid.events.ZoomEvent?): Boolean = false
            })
        }
    )
}
