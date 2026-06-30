package com.lockin.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Calendar;

public final class ScheduleNotifier {
    static final String PREFS = "lockin_schedule";
    private static final int BASE_REQUEST = 7000;

    private ScheduleNotifier() {}

    public static void syncFromJson(Context context, String json) {
        try {
            JSONObject root = new JSONObject(json);
            boolean enabled = root.optBoolean("enabled", true);
            cancelAll(context);
            if (!enabled) {
                context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().remove("lastJson").apply();
                return;
            }

            context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString("lastJson", json).apply();

            JSONArray blocks = root.optJSONArray("blocks");
            if (blocks == null) return;

            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (alarmManager == null) return;

            for (int i = 0; i < blocks.length(); i++) {
                JSONObject block = blocks.getJSONObject(i);
                String id = block.optString("id", "block_" + i);
                String time = block.optString("time", "08:00");
                String label = block.optString("label", "Schedule step");

                int[] hm = parseTime(time);
                if (hm == null) continue;

                Calendar cal = Calendar.getInstance();
                cal.set(Calendar.SECOND, 0);
                cal.set(Calendar.MILLISECOND, 0);
                cal.set(Calendar.HOUR_OF_DAY, hm[0]);
                cal.set(Calendar.MINUTE, hm[1]);
                if (cal.getTimeInMillis() <= System.currentTimeMillis()) {
                    cal.add(Calendar.DAY_OF_YEAR, 1);
                }

                Intent intent = new Intent(context, AlarmReceiver.class);
                intent.putExtra("blockId", id);
                intent.putExtra("label", label);
                intent.putExtra("time", time);

                int requestCode = BASE_REQUEST + Math.abs(id.hashCode() % 10000);
                PendingIntent pi = PendingIntent.getBroadcast(
                        context,
                        requestCode,
                        intent,
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                );

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    alarmManager.setExactAndAllowWhileIdle(
                            AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
                } else {
                    alarmManager.setExact(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
                }
            }
        } catch (Exception ignored) {
            // Invalid JSON from web layer — skip scheduling.
        }
    }

    public static void cancelAll(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;
        for (int i = 0; i < 10000; i++) {
            Intent intent = new Intent(context, AlarmReceiver.class);
            PendingIntent pi = PendingIntent.getBroadcast(
                    context,
                    BASE_REQUEST + i,
                    intent,
                    PendingIntent.FLAG_NO_CREATE | PendingIntent.FLAG_IMMUTABLE
            );
            if (pi != null) {
                alarmManager.cancel(pi);
                pi.cancel();
            }
        }
    }

    static void rescheduleNextDay(Context context, String blockId, String label, String time) {
        try {
            JSONObject root = new JSONObject();
            root.put("enabled", true);
            JSONArray blocks = new JSONArray();
            JSONObject block = new JSONObject();
            block.put("id", blockId);
            block.put("label", label);
            block.put("time", time);
            blocks.put(block);
            root.put("blocks", blocks);
            syncFromJson(context, root.toString());
        } catch (Exception ignored) {
        }
    }

    private static int[] parseTime(String time) {
        if (time == null || !time.contains(":")) return null;
        String[] parts = time.split(":");
        try {
            return new int[]{Integer.parseInt(parts[0]), Integer.parseInt(parts[1])};
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
