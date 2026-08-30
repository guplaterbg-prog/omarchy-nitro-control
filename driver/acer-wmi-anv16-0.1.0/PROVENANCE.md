# Driver source provenance

This directory contains one Linux `acer-wmi` source file with a small,
reviewable patch for the tested Acer Nitro ANV16-71.

## Exact source

- Official repository: `https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git`
- Linux tag: `v7.1.9`
- Tag commit: `ffc82ed665314ccf141abc4710830f3f424d98ea`
- Upstream `acer-wmi.c` Git blob: `e0eaaefb13d04c45a0b6f264d0278281a6119282`
- Upstream `acer-wmi.c` SHA-256:
  `8e3cd3cb8ac24cd387e5d24c69bd47e1b5868ac091d1f83958a3e36273c40f83`
- Patched `acer-wmi.c` SHA-256:
  `d1e4539ce40836ede1f6843a3c80eca2a62312ed2e189cb01d90c0d2023f56cb`

The complete change is stored at
`../patches/0001-acer-wmi-add-anv16-71-and-safe-auto-restore.patch`.
It adds 34 lines and removes none.

## Tested machine

- Vendor: Acer
- Product: Nitro ANV16-71
- BIOS: V1.09
- Running kernel: 7.1.9-arch1-2

The installer refuses to use this bundled fallback on a different product,
BIOS, or kernel. A machine with a compatible interface already supplied by its
kernel does not need this fallback.

## Verify the local files

From the repository root:

```bash
sha256sum --check driver/acer-wmi-anv16-0.1.0/SHA256SUMS
```

To reproduce the patched source, check out the official `v7.1.9` tag, apply
the patch, and compare the resulting SHA-256 with the value above.
