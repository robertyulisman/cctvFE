package com.cctvsecuritymax;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.os.Build;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import java.net.URISyntaxException;
import org.json.JSONException;
import org.json.JSONObject;

public class NotificationService extends Service {
    private static final String TAG = "SOCKETIOMODULE";
    private static final int SERVICE_NOTIFICATION_ID = 12345;
    private static final String CHANNEL_ID = "NOTIFICATIONSERVICE";
    private Socket mSocket;
    private SharedPreferences preferences;

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "NOTIFICATIONSERVICE", importance);
            channel.setDescription("CHANEL DESCRIPTION");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private Emitter.Listener onNewMessage(String event) {
        return new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                Context context = getApplicationContext();
                Intent myIntent = new Intent(context, NotificationEventService.class);
                String data = (String) args[0];
                myIntent.putExtra("data", data);
                if (event == "new") {
                    myIntent.putExtra("new", true);
                }
                if (event == "unsend") {
                    myIntent.putExtra("unSend", true);
                }
                context.startService(myIntent);
                HeadlessJsTaskService.acquireWakeLockNow(context);
            }
        };
    };

    private Emitter.Listener onConnect(String room) {
        this.mSocket.emit("room", room);
        return new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                Context context = getApplicationContext();
                Intent myIntent = new Intent(context, NotificationEventService.class);
                String data = (String) args[0];
                myIntent.putExtra("data", data);
                context.startService(myIntent);
                HeadlessJsTaskService.acquireWakeLockNow(context);
            }
        };
    };

    private void initialize(String connection) {
        try {
            IO.Options opts = new IO.Options();
            opts.forceNew = true;
            opts.reconnection = true;
            opts.timeout = 1000;
            opts.reconnectionAttempts = Integer.MAX_VALUE;
            opts.reconnectionDelay = 1000;
            this.mSocket = IO.socket(connection, opts);

        } catch (URISyntaxException exception) {
            Log.e(TAG, "Socket Initialization error: ", exception);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent,
                PendingIntent.FLAG_CANCEL_CURRENT);
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setPriority(Notification.PRIORITY_LOW).setContentTitle("CCTV SecurityMax")
                .setSmallIcon(R.mipmap.ic_launcher).setContentIntent(contentIntent).setOngoing(true).build();
        startForeground(SERVICE_NOTIFICATION_ID, notification);

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.mSocket.disconnect();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        this.preferences = getApplicationContext().getSharedPreferences("DataSocket", Context.MODE_PRIVATE);
        String connection = preferences.getString("connection", "");
        String room = preferences.getString("room", "");
        this.initialize(connection);
        this.mSocket.on("connection", this.onConnect("_" + room + "_"));
        this.mSocket.on("reconnect", this.onConnect("_" + room + "_"));
        this.mSocket.on("room", this.onNewMessage("room"));
        this.mSocket.on(room + "-new-notif", this.onNewMessage("new"));
        this.mSocket.on(room + "-unsend-notif", this.onNewMessage("unsend"));
        this.mSocket.connect();
        return START_STICKY;
    }

}
