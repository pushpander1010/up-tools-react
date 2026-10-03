#!/bin/bash
# Oracle VM (Oracle Linux: opc user) installer for Laya backend. Run once.
set -e
cd ~/oracle-laya-backend
sudo dnf install -y python3.11 python3.11-pip 2>/dev/null || sudo yum install -y python3.11 python3.11-pip
python3.11 -m venv ~/laya-env || python3 -m venv ~/laya-env
source ~/laya-env/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "Pre-downloading Laya weights..."
python3 -c "import laya; laya.Agent(model_id_or_path='${LAYA_MODEL:-convaiinnovations/laya}')"
echo "Done. Start with: sudo cp laya.service /etc/systemd/system/ && sudo systemctl enable --now laya"
echo "Or test now: source ~/laya-env/bin/activate && uvicorn server:app --host 0.0.0.0 --port 8000"
