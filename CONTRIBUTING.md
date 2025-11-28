# Contributing to ✰ArtSCII✰

> Thank you for your interest in contributing to **✰ArtSCII✰**

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable version)
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/artscii.git
   cd artscii
   ```

3. Add the upstream remote:

   ```bash
   git remote add upstream https://github.com/4ster-light/artscii.git
   ```

4. Build the project:

   ```bash
   cargo build
   ```

5. Run tests:

   ```bash
   cargo test
   ```

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check if the issue already exists. When
creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment (OS, Rust version, etc.)
- Sample images if relevant (or describe the type of image)

### Suggesting Features

Feature requests are welcome! Please:

- Check if the feature has already been suggested
- Provide a clear description of the feature
- Explain why this feature would be useful
- Consider how it fits with the existing CLI options

### Pull Requests

1. Create a new branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

   Use prefixes like `feature/` or `fix/` for clarity.

2. Make your changes following the code style guidelines below.

3. Ensure your code compiles and passes all checks:

   ```bash
   cargo build
   cargo test
   cargo clippy --all-targets
   cargo fmt --check
   ```

4. Commit your changes with a clear message:

   ```bash
   git commit -m "Add: brief description of your changes"
   ```

5. Push to your fork and open a Pull Request.

6. Fill out the PR description explaining your changes.

## Code Style Guidelines

- Follow standard Rust conventions and idioms
- Run `cargo fmt` before committing
- Ensure `cargo clippy` produces no warnings
- Write descriptive variable and function names
- Add comments for complex logic
- Keep functions focused and reasonably sized

### Project Structure

```txt
src/
├── main.rs       # Entry point and main logic
├── cli.rs        # Command-line argument parsing
├── converter.rs  # Image to ASCII conversion logic
├── dithering.rs  # Dithering algorithm implementations
├── error.rs      # Error types and handling
└── output.rs     # Output formatting (terminal, text, HTML)
```

### Adding New Features

- **New dithering algorithm**: Add implementation in `dithering.rs`
- **New output format**: Extend `output.rs`
- **New CLI option**: Update `cli.rs` and integrate in `main.rs`
- **Image processing**: Modify `converter.rs`

## Development Tips

### Running During Development

```bash
# Quick build and run
cargo run -- image.png -c

# Run with release optimizations
cargo run --release -- image.png -c -d atkinson

# Check for issues without building
cargo check
```

### Useful Commands

```bash
# Format code
cargo fmt

# Lint code
cargo clippy

# Run tests
cargo test

# Build release binary
cargo build --release
```

## Code of Conduct

Please be respectful and considerate in all interactions. We aim to maintain a
welcoming and inclusive community, there will be a zero tolerance policy towards
any form of harrasment or discriminations.

## Questions?

If you have questions, feel free to open an issue for discussion.

Thank you for contributing!
