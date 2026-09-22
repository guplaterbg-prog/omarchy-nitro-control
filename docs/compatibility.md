# Compatibility

Nitro Control asks the running kernel what the laptop can do. The laptop name
alone is not enough.

## Full control

Full control works when Linux exposes these standard files for both fans:

```text
pwm1
pwm2
pwm1_enable
pwm2_enable
```

If the official `acer_wmi` driver exposes them on an Acer Nitro, the plugin uses
them. This covers Nitro models supported by the running kernel without a plugin
update. An external `acer_nitro_ec` interface is monitoring-only in v1.

## Gaming-WMI control

Some Nitro generations (including the **AN17-51**) export no hwmon PWM files.
Instead the running kernel's Acer WMI support exposes a Gaming-WMI fan
interface:

```text
/sys/bus/wmi/devices/7A4DDFE7-5B5D-40B4-8595-4408E0CC7F56-*/gaming_fan/
  cpu_mode   gpu_mode    # 0 = Maximum, 1 = Manual, 2 = Automatic
  cpu_speed  gpu_speed   # 0-100 in Manual mode
```

When those four files exist, Nitro Control treats the interface as its fan
provider with the same guarantees as kernel PWM: Automatic, Maximum, verified
20–100% Manual, the 85°C override, and watchdog recovery. Detection is at
runtime only; there is no model allowlist and no fallback driver is installed.

## V1 model table

| Model | V1 status | How it works |
|---|---|---|
| Nitro ANV16-71 | Tested | Fallback only on Linux 7.1.9-arch1-2 + BIOS V1.09 |
| Nitro AN515-58 | Kernel-supported | Uses upstream `acer_wmi` when available |
| Nitro AN17-51 | Tested | Uses Gaming-WMI when the kernel exports it |
| Other Nitro with kernel PWM | Compatible | Detected at runtime |
| Other Nitro with Gaming-WMI | Compatible | Detected at runtime |
| Nitro without PWM | Monitor only | No fan writes |

The ANV16-71 test machine used BIOS V1.09 and Linux 7.1.9-arch1-2. The v1
installer does not load the bundled driver on any other kernel or BIOS. Native
kernel PWM remains usable when detected because no fallback is needed.

## Why unknown models are read-only

Acer Nitro generations do not all use the same firmware commands or embedded
controller registers. A write that is correct on one model can be wrong on
another. Nitro Control therefore needs an exact, tested model entry before it
installs a fallback driver.

## Request support for another model

Run:

```bash
bin/nitro-report > nitro-report.json
```

Review the file, then attach it to an **Unsupported Nitro model** issue. The
report contains the model, BIOS version, kernel version, WMI identifiers, and
available fan interfaces. It deliberately leaves out personal identifiers.

New writable support needs these checks on real hardware:

1. Exact DMI model match.
2. Sensor readings that look correct.
3. Maximum and Automatic mode round-trip.
4. Manual mode and watchdog recovery.
5. Suspend, resume, service stop, and module unload recovery.
