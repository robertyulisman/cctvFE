package com.cctvsecuritymax;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.content.SharedPreferences;

public class BootUpReceiver extends BroadcastReceiver {
    private SharedPreferences preferences;

    @Override
    public void onReceive(Context context, Intent intent) {
        this.preferences = context.getSharedPreferences("DataSocket", Context.MODE_PRIVATE);
        String connection = preferences.getString("connection", "");
        String room = preferences.getString("room", "");
        if (connection.length() > 0 && room.length() > 0) {
            if (intent.getAction() == Intent.ACTION_BOOT_COMPLETED) {
                Intent myIntent = new Intent(context, NotificationService.class);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(myIntent);
                    return;
                }
                context.startService(myIntent);
            }
        }
    }
}
