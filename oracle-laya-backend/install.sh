#!/bin/bash
# Oracle VM (Ubuntu 22.04/24.04) installer for Laya backend. Run once.
set -e
sudo apt update && sudo apt install -y python3-pip python3-venv
python3 -m venv ~/laya-env
source ~/laya-env/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "Pre-downloading Laya weights..."
python3 -c "import laya; laya.Agent(model_id_or_path='${LAYA_MODEL:-convaiinnovations/laya}')"
echo "Done. Run: source ~/laya-env/bin/activate && uvicorn server:app --host 0.0.0.0 --port 8000"
echo "Or install systemd: sudo cp laya.service /etc/systemd/system/ && sudo systemctl enable --now laya"
