"""Allow running the agent as: python -m agents.value_investing_agent"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from agent import main

main()
