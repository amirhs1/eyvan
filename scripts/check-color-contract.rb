#!/usr/bin/env ruby
# frozen_string_literal: true

# -----------------------------------------------------------------------------
# check-color-contract.rb
#
# Repository-native static guard for the color system. Runs three checks against
# the Sass / Liquid / JavaScript sources directly — no Jekyll build, no Node, no
# frontend toolchain — so it can gate every PR in the existing release test job.
#
#   1. Custom-property definedness (audit R8.1)
#      Every consumed var(--color-*) resolves to a definition emitted by
#      _sass/3-base/_base.scss. Fails on any phantom token.
#
#   2. Theme-color sync (audit R8.2)
#      The brand accent in _data/theme.yml matches every checked-in copy
#      (each mode file's $accent-primary fallback and both JS fallbacks),
#      head.html still derives its theme-color from that data, and no retired
#      teal hex is left behind anywhere.
#
#   3. Deterministic token contrast (audit R1)
#      Every key text / UI / syntax pair meets WCAG 2.1 AA, computed straight
#      from the token values. This deterministically catches punctuation-only
#      operator tokens (base0c) that axe can miss on code-heavy pages.
#
# Usage:  ruby scripts/check-color-contract.rb [--root DIR]
# Exit 0 and prints "Color contract policy passed" when clean; otherwise prints
# each violation to stderr and exits 1.
# -----------------------------------------------------------------------------

require "optparse"
require "pathname"
require "set"

# ----- options ---------------------------------------------------------------

options = { root: Pathname(__dir__).join("..").expand_path }
OptionParser.new do |parser|
  parser.banner = "Usage: check-color-contract.rb [--root DIR]"
  parser.on("--root DIR", "Repository root to check (default: repo root)") do |dir|
    options[:root] = Pathname(dir).expand_path
  end
end.parse!

ROOT = options[:root]
LIGHT_MODE = ROOT.join("_sass/0-settings/_light-mode.scss")
DARK_MODE  = ROOT.join("_sass/0-settings/_dark-mode.scss")
BASE       = ROOT.join("_sass/3-base/_base.scss")
THEME_DATA = ROOT.join("_data/theme.yml")
HEAD       = ROOT.join("_includes/head.html")
TOGGLE_JS  = ROOT.join("assets/js/theme-toggle.js")
CHARTS_JS  = ROOT.join("assets/js/demo-climate-charts.js")

# Directories whose source *consumes* the contract (var(--color-*) references).
USE_GLOBS = [
  "_sass/**/*.scss",
  "_includes/**/*.html",
  "_layouts/**/*.html",
  "assets/js/**/*.js"
].freeze

# Retired brand hexes that must never reappear (teal/turquoise pre-aubergine).
RETIRED_HEXES = ["#00796B", "#3FE0D0"].freeze

errors = []

def read(path)
  File.read(path, encoding: "UTF-8")
rescue Errno::ENOENT
  nil
end

# Expand #rgb / #rrggbb to an uppercase #RRGGBB string, or nil if not a hex.
def normalize_hex(value)
  return nil unless value
  match = value.strip.match(/\A#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\z/)
  return nil unless match

  digits = match[1]
  digits = digits.chars.map { |c| c * 2 }.join if digits.length == 3
  "##{digits.upcase}"
end

# Parse `$name: value;` declarations from a Sass mode file into a raw map.
def parse_scss_vars(text)
  map = {}
  text.each_line do |line|
    next if line.strip.start_with?("//")

    match = line.match(/\A\s*\$([\w-]+)\s*:\s*(.+?);/)
    next unless match

    raw = match[2].sub(/\/\/.*\z/, "").sub(/!default\s*\z/, "").strip
    map[match[1]] = raw
  end
  map
end

# Resolve a token to an uppercase #RRGGBB hex, following $references.
def resolve_hex(map, name, seen = [])
  return nil if name.nil? || seen.include?(name)

  raw = map[name]
  return nil if raw.nil?

  if raw.start_with?("$")
    resolve_hex(map, raw[1..], seen + [name])
  else
    normalize_hex(raw)
  end
end

# Relative luminance per WCAG 2.1.
def relative_luminance(hex)
  channels = hex.delete("#").scan(/../).map do |pair|
    c = pair.to_i(16) / 255.0
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055)**2.4
  end
  0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
end

def contrast_ratio(fg, bg)
  l1 = relative_luminance(fg)
  l2 = relative_luminance(bg)
  hi, lo = [l1, l2].max, [l1, l2].min
  (hi + 0.05) / (lo + 0.05)
end

# ----- check 1: custom-property definedness (R8.1) ---------------------------

base_text = read(BASE)
if base_text.nil?
  errors << "definedness: missing #{BASE.relative_path_from(ROOT)}"
else
  defined = Set.new(base_text.scan(/(--color-[a-z0-9-]+)\s*:/i).flatten)
  used = Set.new
  USE_GLOBS.each do |glob|
    Dir.glob(ROOT.join(glob)).sort.each do |file|
      File.read(file, encoding: "UTF-8").scan(/--color-[a-z0-9-]+/i) { |token| used << token }
    end
  end

  undefined = (used - defined).sort
  unless undefined.empty?
    errors << "definedness: consumed but undefined custom properties: #{undefined.join(', ')}"
  end
end

# ----- check 2: theme-color sync (R8.2) --------------------------------------

theme_text = read(THEME_DATA)
if theme_text.nil?
  errors << "theme-color: missing #{THEME_DATA.relative_path_from(ROOT)}"
else
  accent_light = normalize_hex(theme_text[/accent_light:\s*"?(#?[0-9a-fA-F]{3,6})"?/, 1])
  accent_dark  = normalize_hex(theme_text[/accent_dark:\s*"?(#?[0-9a-fA-F]{3,6})"?/, 1])

  if accent_light.nil? || accent_dark.nil?
    errors << "theme-color: could not read accent_light/accent_dark from _data/theme.yml"
  else
    # Each mode file's $accent-primary fallback must equal the data source.
    {
      LIGHT_MODE => accent_light,
      DARK_MODE => accent_dark
    }.each do |file, expected|
      text = read(file)
      rel = file.relative_path_from(ROOT)
      if text.nil?
        errors << "theme-color: missing #{rel}"
        next
      end

      actual = resolve_hex(parse_scss_vars(text), "accent-primary")
      unless actual == expected
        errors << "theme-color: #{rel} $accent-primary #{actual.inspect} != theme.yml #{expected.inspect}"
      end
    end

    # Both JS fallback files must carry the same pair (case-insensitive).
    [TOGGLE_JS, CHARTS_JS].each do |file|
      text = read(file)
      rel = file.relative_path_from(ROOT)
      if text.nil?
        errors << "theme-color: missing #{rel}"
        next
      end

      upcased = text.upcase
      [accent_light, accent_dark].each do |hex|
        unless upcased.include?(hex)
          errors << "theme-color: #{rel} is missing the accent fallback #{hex}"
        end
      end
    end

    # head.html must derive both values from the data source, not hardcode them.
    head_text = read(HEAD)
    if head_text.nil?
      errors << "theme-color: missing #{HEAD.relative_path_from(ROOT)}"
    else
      %w[accent_light accent_dark].each do |key|
        unless head_text.include?("site.data.theme.#{key}")
          errors << "theme-color: head.html does not derive theme-color from site.data.theme.#{key}"
        end
      end
    end

    # No retired teal/turquoise hex may survive in any theme-color consumer.
    {
      "_data/theme.yml" => theme_text,
      "_sass/0-settings/_light-mode.scss" => read(LIGHT_MODE),
      "_sass/0-settings/_dark-mode.scss" => read(DARK_MODE),
      "_includes/head.html" => read(HEAD),
      "assets/js/theme-toggle.js" => read(TOGGLE_JS),
      "assets/js/demo-climate-charts.js" => read(CHARTS_JS)
    }.each do |label, text|
      next if text.nil?

      RETIRED_HEXES.each do |hex|
        errors << "theme-color: retired hex #{hex} still present in #{label}" if text.upcase.include?(hex)
      end
    end
  end
end

# ----- check 3: deterministic token contrast (R1) ----------------------------

# fg token => minimum ratio against ui-bg.
UI_AGAINST_BG = {
  "ui-text" => 4.5,
  "ui-text-muted" => 4.5,
  "heading-color" => 4.5,
  "accent-primary" => 4.5,
  "accent-secondary" => 4.5,
  "state-error" => 4.5,
  "state-success" => 4.5,
  "state-warning" => 4.5,
  "state-info" => 4.5,
  "focus-ring-color" => 3.0 # non-text UI component boundary
}.freeze

SURFACE_TEXT_PAIRS = {
  "ui-surface" => {
    "ui-text" => 4.5,
    "ui-text-muted" => 4.5,
    "heading-color" => 4.5
  },
  "ui-surface-raised" => {
    "ui-text" => 4.5,
    "ui-text-muted" => 4.5,
    "heading-color" => 4.5
  },
  "ui-surface-overlay" => {
    "ui-text" => 4.5,
    "ui-text-muted" => 4.5,
    "heading-color" => 4.5
  }
}.freeze

# Base16 syntax foreground => minimum ratio against base00 (the code canvas).
# base04 is a non-essential foreground (>=3.0); every other slot is text (>=4.5).
SYNTAX_AGAINST_BASE00 = {
  "base03" => 4.5, "base04" => 3.0, "base05" => 4.5, "base06" => 4.5,
  "base07" => 4.5, "base08" => 4.5, "base09" => 4.5, "base0a" => 4.5,
  "base0b" => 4.5, "base0c" => 4.5, "base0d" => 4.5, "base0e" => 4.5,
  "base0f" => 4.5
}.freeze

{ "light" => LIGHT_MODE, "dark" => DARK_MODE }.each do |mode, file|
  text = read(file)
  if text.nil?
    errors << "contrast: missing #{file.relative_path_from(ROOT)}"
    next
  end

  map = parse_scss_vars(text)
  resolve = ->(name) { resolve_hex(map, name) }

  check = lambda do |fg_name, bg_name, minimum, against|
    fg = resolve.call(fg_name)
    bg = resolve.call(bg_name)
    if fg.nil? || bg.nil?
      errors << "contrast (#{mode}): cannot resolve #{fg_name} or #{bg_name}"
      return
    end

    ratio = contrast_ratio(fg, bg)
    if ratio < minimum
      errors << format(
        "contrast (%s): %s on %s is %.2f:1 (needs %.1f:1)",
        mode, fg_name, against, ratio, minimum
      )
    end
  end

  UI_AGAINST_BG.each { |fg, minimum| check.call(fg, "ui-bg", minimum, "ui-bg") }
  SURFACE_TEXT_PAIRS.each do |bg, pairs|
    pairs.each { |fg, minimum| check.call(fg, bg, minimum, bg) }
  end
  # Button/tag text sits on the accent fill, not the page background.
  check.call("text-inverse", "accent-primary", 4.5, "accent-primary")
  SYNTAX_AGAINST_BASE00.each { |fg, minimum| check.call(fg, "base00", minimum, "base00") }
end

# ----- report ----------------------------------------------------------------

if errors.empty?
  puts "Color contract policy passed"
  exit 0
end

warn "Color contract policy failed:"
errors.each { |message| warn "  - #{message}" }
exit 1
