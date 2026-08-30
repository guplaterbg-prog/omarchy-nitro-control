# Kernel compatibility fallback

Nitro Control always prefers the running kernel's native `acer_wmi` hwmon
interface. The bundled DKMS module is installed only when PWM control is
missing and the exact DMI model, kernel, and BIOS appear in
`verified-models.json`.

The current fallback is the official Linux 7.1.9 `acer-wmi.c`, licensed
GPL-2.0-or-later, with two focused changes:

1. A Predator-v4/PWM DMI quirk for `Nitro ANV16-71`.
2. Automatic fan restoration on module removal, suspend, and shutdown.

Unknown firmware is never opted into writable fan control. Owners of other
Nitro models can still use native kernel support and can contribute a hardware
report before a new fallback entry is added.

See `acer-wmi-anv16-0.1.0/PROVENANCE.md` for the official Linux repository,
tag, source hashes, tested machine, and reproduction instructions. The full
34-line change is in `patches/`; `SHA256SUMS` protects every DKMS input file.
