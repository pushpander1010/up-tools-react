# Stranger-chat backend (Oracle VM)

Anonymous 1-1 signalling + relay for `uptools.in/stranger-chat`.
Text, images (<2MB), voice notes (<2MB) and WebRTC voice-call signalling.
Stores nothing: no logs, no images, no recordings. Sockets in memory only.

## 1. Install on the Oracle VM

```
scp -r oracle-stranger-backend ubuntu@ORACLE_IP:~/
ssh ubuntu@ORACLE_IP
cd ~/oracle-stranger-backend && npm install
```

## 2. Open the port (OCI security list)

Ingress TCP 8080 (or your choice), source 0.0.0.0/0. Later Caddy proxies
`wss://chat.uptools.in` to it, so only localhost needs access.

## 3. Run (systemd)

```
# /etc/systemd/system/stranger.service
[Unit]
Description=stranger chat relay
After=network.target
[Service]
WorkingDirectory=/home/ubuntu/oracle-stranger-backend
ExecStart=/usr/bin/node server.js
Environment=PORT=8080
Restart=always
[Install]
WantedBy=multi-user.target
```
```
sudo systemctl enable --now stranger
curl http://127.0.0.1:8080/health
```

## 4. Caddy (same VM)

```
chat.uptools.in {
  reverse_proxy 127.0.0.1:8080
}
```
Frontend `BACKEND_URL` becomes `wss://chat.uptools.in`. No code change needed.

## 5. Safety (IT Rules 2021, 18+)

- Client sends `adult:true` at join; server drops anyone who does not attest 18+.
- `report` message auto-unpairs + blocks; 3 reports kills the socket.
- Rate limit 20 msgs / 10s per socket; 2MB payload cap.
- Grievance contact on the tool page: grievance@uptools.in (respond within 72h per IT Rules).
- Recommended next step before public launch: TURN server (coturn) for voice calls behind symmetric NATs, plus a daily abuse-review cron on report counts (counts only, never content).
