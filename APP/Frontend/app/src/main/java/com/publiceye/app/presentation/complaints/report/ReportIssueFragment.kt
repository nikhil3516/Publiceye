package com.publiceye.app.presentation.complaints.report

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.location.Geocoder
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.publiceye.app.R
import com.publiceye.app.databinding.FragmentReportIssueBinding
import kotlinx.coroutines.launch
import java.io.File
import java.util.*

class ReportIssueFragment : Fragment(), OnMapReadyCallback {

    private var _binding: FragmentReportIssueBinding? = null
    private val binding get() = _binding!!

    private var googleMap: GoogleMap? = null
    private var latestTmpUri: Uri? = null
    private var selectedLatLng: LatLng? = null

    private val categories = listOf(
        "Roads & Potholes", "Garbage & Waste", "Water Supply",
        "Electricity", "Sewage", "Public Property", "Other"
    )

    private val takePictureLauncher = registerForActivityResult(ActivityResultContracts.TakePicture()) { success ->
        if (success) {
            latestTmpUri?.let { uri ->
                binding.emptyImageState.visibility = View.GONE
                binding.ivPreview.setImageURI(uri)
                analyzeImage(uri)
            }
        }
    }

    private val selectImageLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        uri?.let {
            binding.emptyImageState.visibility = View.GONE
            binding.ivPreview.setImageURI(it)
            analyzeImage(it)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentReportIssueBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupCategorySpinner()
        setupMap()

        binding.btnCamera.setOnClickListener {
            latestTmpUri = getTmpFileUri()
            takePictureLauncher.launch(latestTmpUri)
        }

        binding.btnGallery.setOnClickListener {
            selectImageLauncher.launch("image/*")
        }

        binding.btnCurrentLocation.setOnClickListener {
            getCurrentLocation()
        }
    }

    private fun setupCategorySpinner() {
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_dropdown_item_1line, categories)
        binding.spinnerCategory.setAdapter(adapter)
    }

    private fun setupMap() {
        val mapFragment = childFragmentManager.findFragmentById(R.id.mapFragment) as SupportMapFragment
        mapFragment.getMapAsync(this)
    }

    override fun onMapReady(map: GoogleMap) {
        googleMap = map
        googleMap?.uiSettings?.isZoomControlsEnabled = true
    }

    private fun getCurrentLocation() {
        if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            val fusedLocationClient = LocationServices.getFusedLocationProviderClient(requireActivity())
            fusedLocationClient.lastLocation.addOnSuccessListener { location ->
                location?.let {
                    val latLng = LatLng(it.latitude, it.longitude)
                    updateLocationOnMap(latLng)
                }
            }
        } else {
            requestPermissions(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 1001)
        }
    }

    private fun updateLocationOnMap(latLng: LatLng) {
        selectedLatLng = latLng
        googleMap?.clear()
        googleMap?.addMarker(MarkerOptions().position(latLng).title("Issue Location"))
        googleMap?.animateCamera(CameraUpdateFactory.newLatLngZoom(latLng, 15f))
        
        reverseGeocode(latLng)
    }

    private fun reverseGeocode(latLng: LatLng) {
        val geocoder = Geocoder(requireContext(), Locale.getDefault())
        try {
            val addresses = geocoder.getFromLocation(latLng.latitude, latLng.longitude, 1)
            if (addresses?.isNotEmpty() == true) {
                binding.tvAddress.text = addresses[0].getAddressLine(0)
            }
        } catch (e: Exception) {
            binding.tvAddress.text = "${latLng.latitude}, ${latLng.longitude}"
        }
    }

    private fun analyzeImage(uri: Uri) {
        binding.shimmerView.visibility = View.VISIBLE
        binding.shimmerView.startShimmer()
        
        // Mock AI analysis for now
        lifecycleScope.launch {
            kotlinx.coroutines.delay(2000)
            binding.shimmerView.stopShimmer()
            binding.shimmerView.visibility = View.GONE
            binding.aiResultContainer.visibility = View.VISIBLE
            // Logic for real AI call would go here
        }
    }

    private fun getTmpFileUri(): Uri {
        val tmpFile = File.createTempFile("tmp_image_file", ".png", requireContext().cacheDir).apply {
            createNewFile()
            deleteOnExit()
        }
        return FileProvider.getUriForFile(requireContext(), "${requireContext().packageName}.fileprovider", tmpFile)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
