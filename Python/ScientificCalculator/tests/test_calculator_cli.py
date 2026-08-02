import os
import subprocess
import sys
import unittest

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class CalculatorCliTests(unittest.TestCase):
    def test_cli_expression_runs_and_exits(self):
        completed = subprocess.run(
            [sys.executable, os.path.join(ROOT, "calculator.py"), "2+2"],
            capture_output=True,
            text=True,
            cwd=ROOT,
            timeout=10,
        )

        self.assertEqual(completed.returncode, 0, completed.stderr)
        self.assertIn("4", completed.stdout)


if __name__ == "__main__":
    unittest.main()
