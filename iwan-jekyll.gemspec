# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "analytics-link"
  spec.version       = "0.1.0"
  spec.authors       = ["Vidhya"]
  spec.email         = ["vidhyav656@gmail.com"]

  spec.summary       = "A beautiful, minimal theme for Jekyll."
  spec.homepage      = "https://github.com/analytics-link/analytics-link.github.io"
  spec.license       = "MIT"

  spec.metadata["plugin_type"] = "theme"

  spec.files                   = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r{^(assets|_(includes|layouts|sass)/|(LICENSE|README|CHANGELOG)((\.(txt|md|markdown)|$)))}i)
  end

  spec.add_runtime_dependency "jekyll", "~> 4.0.0"
  spec.add_runtime_dependency "jekyll-feed", "~> 0.13"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1.0"

  spec.add_runtime_dependency "bundler", "~> 2.1.4"
end
