# Troubleshooting

## The icon shows `!`

Open the panel and select **Install system support**. Enter your password in
the terminal that opens.

## I can see temperatures but cannot control the fans

Your kernel has sensor support but no compatible PWM interface. This is normal
for an unverified Nitro model. Create a compatibility report instead of trying
another model's fan registers.

## The fans are too loud

Return to Acer's automatic control:

```bash
nitroctl automatic
```

Then select the Balanced or Quiet performance profile.

## Check the service

```bash
systemctl status nitro-control
nitroctl status
```

## A kernel update removed control

Check DKMS:

```bash
dkms status
```

Run the plugin's `install` script again. V1 rebuilds the fallback only when the
kernel and BIOS exactly match a tested registry entry. On another kernel it
leaves the plugin read-only instead of guessing that the patch is compatible.

## Collect a safe report

```bash
~/.config/omarchy/plugins/nitro.control/bin/nitro-report > nitro-report.json
```

Read the JSON before posting it. It should not contain a serial number,
hostname, username, or network address.
