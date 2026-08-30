function emptyState() {
  return {
    ok: false,
    version: "",
    backend: "missing",
    vendor: "",
    model: "Acer Nitro",
    biosVersion: "",
    isNitro: false,
    sensorAvailable: false,
    controlAvailable: false,
    hwmonName: "",
    controlProvider: "",
    temperatures: { cpu: null, gpu: null, system: null },
    fans: {
      cpu: { rpm: null, percent: null },
      gpu: { rpm: null, percent: null }
    },
    mode: "unavailable",
    modeCode: null,
    profile: "",
    profileChoices: [],
    error: ""
  }
}

function parseStatus(raw, previous) {
  var fallback = previous || emptyState()
  var parsed
  try {
    parsed = JSON.parse(String(raw || ""))
  } catch (error) {
    return Object.assign({}, fallback, { ok: false, error: "Invalid backend response" })
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    return Object.assign({}, fallback, { ok: false, error: "Invalid backend response" })
  return Object.assign({}, emptyState(), fallback, parsed, {
    temperatures: Object.assign({}, emptyState().temperatures, parsed.temperatures || {}),
    fans: {
      cpu: Object.assign({}, emptyState().fans.cpu, (parsed.fans || {}).cpu || {}),
      gpu: Object.assign({}, emptyState().fans.gpu, (parsed.fans || {}).gpu || {})
    },
    profileChoices: Array.isArray(parsed.profileChoices) ? parsed.profileChoices : []
  })
}

function temperature(value) {
  if (value === null || value === undefined || value === "") return "—"
  var number = Number(value)
  return isFinite(number) ? Math.round(number) + "°" : "—"
}

function rpm(value) {
  if (value === null || value === undefined || value === "") return "—"
  var number = Number(value)
  return isFinite(number) ? Math.round(number).toLocaleString() + " RPM" : "—"
}

function percent(value) {
  if (value === null || value === undefined || value === "") return "—"
  var number = Number(value)
  return isFinite(number) ? Math.round(number) + "%" : "—"
}

function modeTitle(mode) {
  if (mode === "automatic") return "Automatic"
  if (mode === "maximum") return "Maximum"
  if (mode === "manual") return "Manual"
  if (mode === "mixed") return "Mixed"
  return "Unavailable"
}

function statusLine(state) {
  if (!state.isNitro && state.vendor) return "Unsupported hardware"
  if (!state.sensorAvailable) return "Kernel support required"
  if (state.backend !== "ready") return "Read-only · setup required"
  return modeTitle(state.mode) + " · " + (state.profile || "no profile")
}

function barText(state, showTemperature) {
  var icon = state.mode === "maximum" ? "󰈸" : "󰈐"
  if (!state.sensorAvailable) return icon + " !"
  return showTemperature ? icon + " " + temperature(state.temperatures.cpu) : icon
}

function clampManual(value) {
  var number = Math.round(Number(value))
  if (!isFinite(number)) return 40
  return Math.max(20, Math.min(100, number))
}

function profileTitle(profile) {
  return String(profile || "")
    .split("-")
    .map(function(part) { return part ? part.charAt(0).toUpperCase() + part.slice(1) : "" })
    .join(" ")
}

function profileIcon(profile) {
  if (profile === "low-power") return "󰌪"
  if (profile === "quiet") return "󰝟"
  if (profile === "performance") return "󰓅"
  if (profile === "balanced-performance") return "󰾅"
  return "󰊚"
}

function profileShort(profile) {
  if (profile === "low-power") return "Saver"
  if (profile === "balanced-performance") return "Balanced+"
  return profileTitle(profile)
}

if (typeof module !== "undefined") {
  module.exports = {
    emptyState: emptyState,
    parseStatus: parseStatus,
    temperature: temperature,
    rpm: rpm,
    percent: percent,
    modeTitle: modeTitle,
    statusLine: statusLine,
    barText: barText,
    clampManual: clampManual,
    profileTitle: profileTitle,
    profileIcon: profileIcon,
    profileShort: profileShort
  }
}
