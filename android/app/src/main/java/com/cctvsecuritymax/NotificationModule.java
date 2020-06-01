package com.cctvsecuritymax;

import android.content.Intent;
import android.os.Build;
import android.content.Context;
import android.content.SharedPreferences;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class NotificationModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "NotifBackService";
    private static ReactApplicationContext reactContext;
    private SharedPreferences preferences;
    private SharedPreferences.Editor editor;

    public NotificationModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startService(String connection, String room) {

        this.preferences = this.reactContext.getSharedPreferences("DataSocket", Context.MODE_PRIVATE);
        this.editor = this.preferences.edit();
        this.editor.putString("connection", connection);
        this.editor.putString("room", room);
        this.editor.apply();
        Intent myIntent = new Intent(this.reactContext, NotificationService.class);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            this.reactContext.startForegroundService(myIntent);
        } else {
            this.reactContext.startService(myIntent);
        }

    }

    @ReactMethod
    public void stopService() {
        this.preferences = this.reactContext.getSharedPreferences("DataSocket", Context.MODE_PRIVATE);
        this.editor = this.preferences.edit();
        this.editor.putString("connection", "");
        this.editor.putString("room", "");
        this.editor.apply();
        this.reactContext.stopService(new Intent(this.reactContext, NotificationService.class));
    }
}
