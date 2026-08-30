#!/usr/bin/env python3

from __future__ import annotations

import sys
import unittest
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "driver"))

from select_verified_driver import EnvironmentNotVerified, select_driver  # noqa: E402


class DriverRegistryTests(unittest.TestCase):
    registry = PROJECT_ROOT / "driver/verified-models.json"

    def test_exact_tested_environment_selects_fallback(self) -> None:
        package = select_driver(
            self.registry,
            "Acer",
            "Nitro ANV16-71",
            "7.1.9-arch1-2",
            "V1.09",
        )
        self.assertEqual(package, "acer-wmi-anv16-0.1.0")

    def test_different_kernel_is_rejected(self) -> None:
        with self.assertRaisesRegex(EnvironmentNotVerified, "kernel"):
            select_driver(
                self.registry,
                "Acer",
                "Nitro ANV16-71",
                "7.1.10-arch1-1",
                "V1.09",
            )

    def test_different_bios_is_rejected(self) -> None:
        with self.assertRaisesRegex(EnvironmentNotVerified, "BIOS"):
            select_driver(
                self.registry,
                "Acer",
                "Nitro ANV16-71",
                "7.1.9-arch1-2",
                "V1.10",
            )

    def test_unknown_model_has_no_fallback(self) -> None:
        self.assertEqual(
            select_driver(self.registry, "Acer", "Nitro Unknown", "7.1.9-arch1-2", "V1.09"),
            "",
        )


if __name__ == "__main__":
    unittest.main()
