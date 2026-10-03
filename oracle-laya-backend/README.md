Laya backend for Oracle. Real Laya choice inference (convaiinnovations/laya).

Oracle VM setup:
1. Copy this folder to VM: scp -r oracle-laya-backend ubuntu@ORACLE_IP:~/
2. SSH in, run: cd ~/oracle-laya-backend && bash install.sh
3. Open port 8000 in OCI security list (ingress TCP 8000).
4. Start: uvicorn server:app --host 0.0.0.0 --port 8000 (or systemd laya.service)
5. Test: curl -X POST http://ORACLE_IP:8000/decide -H 'Content-Type: application/json' -d '{"question":"lunch?","choices":["salad","pizza","biryani"]}'

Frontend (uptools random-choice-generator) posts {question, choices} to YOUR_VM/decide and shows pick + probabilities. Paste VM URL in the Laya backend box on the page.
