package com.publiceye.app.presentation.complaints.track

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.publiceye.app.R
import com.publiceye.app.databinding.ItemTimelineBinding

class TimelineAdapter(private var items: List<TimelineItem>) :
    RecyclerView.Adapter<TimelineAdapter.TimelineViewHolder>() {

    class TimelineViewHolder(val binding: ItemTimelineBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TimelineViewHolder {
        val binding = ItemTimelineBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return TimelineViewHolder(binding)
    }

    override fun onBindViewHolder(holder: TimelineViewHolder, position: Int) {
        val item = items[position]
        holder.binding.tvStageName.text = item.stage
        holder.binding.tvStatusMessage.text = item.description
        holder.binding.tvTimestamp.text = item.timestamp

        // Timeline styling
        val context = holder.itemView.context
        when (item.status) {
            TimelineStatus.COMPLETED -> {
                holder.binding.dotCircle.setBackgroundResource(R.drawable.bg_circle_teal)
                holder.binding.lineConnector.setBackgroundColor(
                    ContextCompat.getColor(context, R.color.teal_700)
                )
            }
            TimelineStatus.ACTIVE -> {
                holder.binding.dotCircle.setBackgroundResource(R.drawable.bg_circle_teal_pulsing)
                holder.binding.lineConnector.setBackgroundColor(
                    ContextCompat.getColor(context, R.color.grey_300)
                )
            }
            TimelineStatus.PENDING -> {
                holder.binding.dotCircle.setBackgroundResource(R.drawable.bg_circle_light)
                holder.binding.lineConnector.setBackgroundColor(
                    ContextCompat.getColor(context, R.color.grey_300)
                )
            }
        }

        // Hide connector line for last item
        holder.binding.lineConnector.visibility =
            if (position == items.size - 1) View.GONE else View.VISIBLE
    }

    override fun getItemCount() = items.size

    fun updateItems(newItems: List<TimelineItem>) {
        items = newItems
        notifyDataSetChanged()
    }
}
