package com.lockin.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || intent.getAction() == null) return;
        if (!Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) return;
        String json = context.getSharedPreferences(ScheduleNotifier.PREFS, Context.MODE_PRIVATE)
                .getString("lastJson", null);
        if (json != null) {
            ScheduleNotifier.syncFromJson(context, json);
        }
    }
}
