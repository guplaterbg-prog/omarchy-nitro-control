# Nitro Control 1.0.2

This release adds fan control for Nitro models that expose no hwmon PWM, and a
live MangoHud FPS readout in the bar.

## Fan control via Acer Gaming-WMI

Newer Nitros (including the AN17-51) have no `pwm1`/`pwm2` files. When the
running kernel exports the Gaming-WMI fan interface, Nitro Control now uses it
for the full Automatic / Maximum / Manual feature set:

```text
/sys/bus/wmi/devices/7A4DDFE7-5B5D-40B4-8595-4408E0CC7F56-*/gaming_fan/
  cpu_mode   gpu_mode    # 0 = Maximum, 1 = Manual, 2 = Automatic
  cpu_speed  gpu_speed   # 0-100 in Manual mode
```

Detection is purely runtime. The 85°C thermal override, manual-mode lease, and
watchdog recovery behave exactly as with kernel PWM. Tested on a Nitro AN17-51.

## FPS in the bar

With MangoHud running in a game, the bar shows live FPS next to the
temperatures (Settings → Show FPS). The widget reads the newest MangoHud
benchmark log each second and only reports logs written within the last
8 seconds, so the readout clears on its own when the game exits. A GPU
temperature toggle is new too. See [README](../README.md) for the MangoHud
setup (`log_interval`, `output_folder`, `autostart_log`).