package com.publiceye.app.presentation.components

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.util.AttributeSet
import android.view.View

class SLATimerView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private var progress: Float = 1.0f // 1.0 = 100%, 0.0 = 0%
    private var color: Int = Color.parseColor("#009688") // Default Teal

    private val backgroundPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 12f
        color = Color.parseColor("#F1F5F9")
    }

    private val progressPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 12f
        strokeCap = Paint.Cap.ROUND
    }

    private val rect = RectF()

    fun setProgress(newProgress: Float, newColor: Int) {
        progress = newProgress.coerceIn(0f, 1f)
        color = newColor
        invalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val width = width.toFloat()
        val height = height.toFloat()
        val size = Math.min(width, height) - 20f
        
        rect.set(
            (width - size) / 2,
            (height - size) / 2,
            (width + size) / 2,
            (height + size) / 2
        )

        canvas.drawOval(rect, backgroundPaint)
        
        progressPaint.color = color
        val sweepAngle = 360 * progress
        canvas.drawArc(rect, -90f, sweepAngle, false, progressPaint)
    }
}
