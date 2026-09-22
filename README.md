# Nitro Control for Omarchy

Fan control for Acer Nitro laptops, directly in the Omarchy bar.

Nitro Control shows CPU/GPU temperature and fan speed. When the laptop and
kernel support it, you can choose Automatic, Maximum, or a manual fan speed.

The safe default is **Automatic**.

## Will it work on my Nitro?

| What your laptop has | What Nitro Control does |
|---|---|
| Official kernel `acer_wmi` PWM controls | Full fan control |
| Acer Gaming-WMI fan control (see below) | Full fan control via the WMI interface |
| Tested ANV16-71 kernel/BIOS without PWM | Installs the tested v1 fallback |
| Temperatures and RPM, but no PWM | Shows information; does not write |
| Unknown hardware | Refuses fan writes |

### Acer Gaming-WMI laptops (Nitro AN17, AN16 and similar)

Newer Nitros expose no hwmon `pwm1/pwm2` files. Instead the in-tree Acer
drivers (and the ASense kernel driver) export a **Gaming-WMI** fan interface:

```text
/sys/bus/wmi/devices/7A4DDFE7-5B5D-40B4-8595-4408E0CC7F56-*/gaming_fan/
  cpu_mode   gpu_mode    # 0 = Maximum, 1 = Manual, 2 = Automatic
  cpu_speed  gpu_speed   # 0-100 in Manual mode
```

When this interface is present, Nitro Control uses it in place of hwmon PWM:
Automatic/Maximum/Manual all work, and the 85°C thermal override still applies.
Tested on a **Nitro AN17-51**. No model lookup is involved — the interface is
detected at runtime, exactly like kernel PWM.

The Nitro AN515-58 is supported by newer upstream Linux kernels. Other Nitro
models also work when their official kernel driver exposes the same standard
PWM interface.
See the [plain-English compatibility guide](docs/compatibility.md) for details.

## Install

1. Add the plugin:

   ```bash
   omarchy plugin add https://github.com/nodramaollama/omarchy-nitro-control.git --enable
   ```

2. Open the fan icon in the Omarchy bar.
3. Select **Install system support** and enter your password once.

No reboot or logout is normally needed.

The root installer first copies an exact, digest-verified release payload into
a root-owned, no-follow snapshot. Privileged installation reads only from that
snapshot. It installs the backend under `/usr/lib/nitro-control`, the
`nitroctl` client under `/usr/bin`, and one systemd service. On the exact tested
ANV16-71 kernel and BIOS only, it may also install the checksummed DKMS
fallback.

DKMS setup is an explicit manual prerequisite. If the installer reports that
DKMS or matching kernel headers are absent, install the named packages with
`omarchy pkg add`, then run **Install system support** again. The plugin never
runs a package manager as root.

## Use

- **Automatic** — Acer firmware controls the fans. Use this normally.
- **Maximum** — both fans run at full speed until you choose another mode.
- **Manual** — choose 20–100%. The linked-fans setting uses one slider.

Right-click the bar icon at any time to return to Automatic.

You can also run:

```bash
nitroctl status
nitroctl automatic
```

## FPS in the bar (MangoHud)

When MangoHud is running in a game, Nitro Control shows the live FPS next to
the temperature readout (toggle under **Settings → Show FPS**). It reads the
most recently written MangoHud benchmark log, so no extra daemon is needed.

Requirements:

1. MangoHud installed and actually injected into the game — Steam launch
   options `MANGOHUD=1 %command%`, or a gamescope session with `--mangoapp`.
2. MangoHud logging configured in `~/.config/MangoHud/MangoHud.conf`:

   ```ini
   log_interval=1000
   output_folder=$HOME/.local/share/MangoHud
   autostart_log=1
   ```

   MangoHud then writes one `csv` per game session to that folder. The widget
   only reports values from a log being written within the last 8 seconds, so
   the FPS disappears on its own after you close the game. For OpenGL games
   (e.g. Minecraft) launch the game through `mangohud` so the GL shim is
   preloaded; Vulkan titles only need `MANGOHUD=1`.

## Why it is safe

- The bar widget never runs as root.
- Fan writes go through a small system service.
- Only the exact desktop user chosen during installation may send commands.
- Users cannot replace the service's local socket.
- Manual values below 20% are rejected.
- Manual is blocked at 85°C; an active session reaching 85°C forces Maximum.
- Manual mode needs a heartbeat from the widget.
- If the widget or service stops, the fans return to Automatic.
- Unsupported models remain read-only.
- Every privileged release artifact is bound to `release-manifest.sha256`.
- Installation is transactional: a late failure restores the previous files,
  service state, and DKMS state.
- UI subprocesses have deadlines, bounded output, and plain-text display.

Read [Safety](docs/safety.md) for the full design.

The bundled kernel source has an exact upstream tag, checksums, and a complete
34-line patch in [driver/README.md](driver/README.md).

## Add another Nitro model

Create a private report first:

```bash
~/.config/omarchy/plugins/nitro.control/bin/nitro-report > nitro-report.json
```

The report excludes serial numbers, usernames, hostnames, and network data.
Read it before sharing it, then open an **Unsupported Nitro model** issue.

We only enable a new fallback after testing that exact model. We do not guess
embedded-controller registers from a similar laptop.

## Remove

```bash
~/.config/omarchy/plugins/nitro.control/uninstall
omarchy plugin remove nitro.control
```

The uninstaller returns the fans to Automatic and confirms the hardware state
before removing system support. If that cannot be confirmed, it leaves the
service and driver in place and stops with recovery instructions.

## Verify a release

Release tags are signed. After cloning, verify v1.0.2 and its privileged
payload with:

```bash
git -c gpg.ssh.allowedSignersFile=.github/release-signers verify-tag v1.0.2
sha256sum --check --strict release-manifest.sha256
./install --target-user "$USER" --verify-release
```

## Documentation

- [Compatibility](docs/compatibility.md)
- [Safety](docs/safety.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Architecture](docs/architecture.md)
- [Contributing](CONTRIBUTING.md)

## Acknowledgments

The 1.0.2 additions in this fork (Acer Gaming-WMI fan provider, MangoHud FPS
readout, GPU temperature toggle, and their documentation) were developed with
the assistance of an AI coding assistant, tested on Acer Nitro AN17-51.
Original v1.0 by the Nitro Control contributors.

## License

The plugin and backend are MIT licensed. Bundled Linux kernel driver source is
GPL-2.0-or-later. See [driver/README.md](driver/README.md).
