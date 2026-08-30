# Contributing

Thanks for helping another Acer Nitro owner.

## Report a model

Use the **Unsupported Nitro model** issue form. Attach the output of:

```bash
bin/nitro-report > nitro-report.json
```

Please do not post serial numbers or Acer SNIDs.

## When a model can become writable

A model is added to the verified fallback list only after a real owner tests:

- exact DMI detection;
- temperatures and RPM;
- Maximum -> Automatic recovery;
- Manual mode at a safe speed;
- the 12-second watchdog;
- suspend/resume and service stop;
- module unload when a custom module is required.

Similar model names are not proof of compatible firmware.

## Code changes

Keep the UI unprivileged and use standard Linux hwmon/platform-profile
interfaces. Do not add direct firmware writes to QML.

Run before opening a pull request:

```bash
omarchy plugin validate .
python -m unittest discover -s tests -v
node tests/model.test.mjs
bash -n install uninstall bin/nitroctl bin/nitro-report
cd driver/acer-wmi-anv16-0.1.0 && sha256sum --check --strict SHA256SUMS
```

Explain any hardware write and its failure recovery in the pull request.
Automated CI must never run the root installer, load modules, or issue real fan
commands.
