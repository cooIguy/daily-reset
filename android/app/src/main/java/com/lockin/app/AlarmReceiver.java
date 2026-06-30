package com.lockin.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import androidx.core.app.NotificationCompat;

public class AlarmReceiver extends BroadcastReceiver {
    static final String CHANNEL_ID = "lockin_schedule";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;

        String label = intent.getStringExtra("label");
        String blockId = intent.getStringExtra("blockId");
        String time = intent.getStringExtra("time");
        if (label == null) label = "Schedule step";

        ensureChannel(context);

        Intent open = new Intent(context, AppWebViewActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent content = PendingIntent.getActivity(
                context,
                blockId != null ? blockId.hashCode() : 0,
                open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Lock In")
                .setContentText(time + " — " + label)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setContentIntent(content);

        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.notify(blockId != null ? blockId.hashCode() : (int) System.currentTimeMillis(), builder.build());
        }

        if (blockId != null && time != null) {
            ScheduleNotifier.rescheduleNextDay(context, blockId, label, time);
        }
    }

    static void ensureChannel(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Daily schedule",
                NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("Reminders for each step in your day");
        nm.createNotificationChannel(channel);
    }
}
