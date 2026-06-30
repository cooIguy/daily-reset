package com.lockin.app;

import android.content.Context;
import android.webkit.JavascriptInterface;

public class WebAppBridge {
    private final Context context;

    WebAppBridge(Context context) {
        this.context = context.getApplicationContext();
    }

    @JavascriptInterface
    public void syncSchedule(String json) {
        ScheduleNotifier.syncFromJson(context, json);
    }
}
