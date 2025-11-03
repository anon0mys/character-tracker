# Character Tracker

A comprehensive D&D 5e campaign tracking utility built with Ruby on Rails and React. This application helps players and DMs manage characters, spells, items, and campaign data for their D&D 5e games.

## Features

- **Character Management**: Create and manage player characters with full D&D 5e rules integration
- **Spell Tracking**: Browse and organize spells with advanced filtering and spell list management
- **Item Inventory**: Track character equipment and items
- **Campaign Organization**: Manage games, NPCs, factions, and locations
- **Archetype Rules**: Built-in implementation of all D&D 5e class rules and leveling
- **GraphQL API**: Flexible API layer for data queries
- **RESTful API**: Traditional REST endpoints for standard operations

## Tech Stack

- **Backend**: Ruby on Rails 6.1, PostgreSQL
- **Frontend**: React 18, TypeScript, TailwindCSS
- **Authentication**: Devise with JWT
- **Testing**: RSpec, FactoryBot
- **Linting**: RuboCop, ESLint (via TypeScript)
- **Deployment**: Docker-ready

## Prerequisites

Before you begin, ensure you have the following installed:

- **Ruby** 3.2.1 (recommended to use [rbenv](https://github.com/rbenv/rbenv) or [rvm](https://rvm.io/))
- **Node.js** (v18 or higher) and **Yarn**
- **PostgreSQL** 12 or higher
- **Docker** and **Docker Compose** (optional, for containerized setup)
- **Bundler** (`gem install bundler`)

## Setup

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd character-tracker
   ```

2. **Install Ruby dependencies**
   ```bash
   bundle install
   ```

3. **Install JavaScript dependencies**
   ```bash
   yarn install
   ```

4. **Set up the database**
   ```bash
   # Create and migrate the database
   bin/rails db:create
   bin/rails db:migrate
   
   # Optionally, load seed data
   bin/rails db:seed
   ```

5. **Set up environment variables**
   
   Create a `.env` file in the root directory (you may need to copy from `.env.example` if it exists):
   ```bash
   # Database configuration (if not using defaults)
   DATABASE_URL=postgresql://localhost/character_tracker_development
   
   # Rails secrets (generate with: bin/rails secret)
   SECRET_KEY_BASE=your_secret_key_here
   ```

6. **Run the setup script** (optional, automates steps 2-4)
   ```bash
   bin/setup
   ```

### Docker Setup

For a containerized development environment:

1. **Build and start containers**
   ```bash
   docker-compose up --build
   ```

2. **Set up the database** (in a new terminal)
   ```bash
   docker-compose exec web bin/rails db:create db:migrate
   ```

3. **Access the application**
   
   The Rails server will be available at `http://localhost:3000`
   PostgreSQL will be available at `localhost:5432`

## Running the Application

### Local Development

1. **Start the database** (if not using Docker)
   ```bash
   # On macOS with Homebrew
   brew services start postgresql
   
   # On Linux
   sudo systemctl start postgresql
   ```

2. **Start the development servers**
   
   Using Foreman (recommended):
   ```bash
   foreman start -f Procfile.dev
   ```
   
   Or manually in separate terminals:
   ```bash
   # Terminal 1: Rails server
   bin/rails server
   
   # Terminal 2: JavaScript build watcher
   yarn build --watch
   
   # Terminal 3: CSS build watcher
   yarn build:css --watch
   ```

3. **Access the application**
   
   - Main application: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin`
   - GraphQL playground: `http://localhost:3000/graphiql` (if enabled in development)

### Docker Development

```bash
# Start all services
docker-compose up

# View logs
docker-compose logs -f web

# Run Rails console
docker-compose exec web bin/rails console

# Run database migrations
docker-compose exec web bin/rails db:migrate
```

## Running Tests

### RSpec (Ruby Tests)

Run all tests:
```bash
bundle exec rspec
```

Run specific test files:
```bash
bundle exec rspec spec/models/character_spec.rb
bundle exec rspec spec/services/character_service_spec.rb
```

Run tests with coverage:
```bash
COVERAGE=true bundle exec rspec
```

View coverage report:
```bash
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
```

### Running Linters

**RuboCop** (Ruby linting and formatting):
```bash
# Check for offenses
bundle exec rubocop

# Auto-correct safe offenses
bundle exec rubocop -a

# Auto-correct all offenses (use with caution)
bundle exec rubocop -A
```

**TypeScript/JavaScript** (via TypeScript compiler):
```bash
# Type check
yarn tsc --noEmit
```

### Running All Checks

Before committing, ensure all checks pass:
```bash
# Run tests
bundle exec rspec

# Run linters
bundle exec rubocop
yarn tsc --noEmit
```

## Code Style and Linting

This project follows Ruby community best practices and uses RuboCop for linting and style enforcement.

### RuboCop Configuration

The project uses:
- **RuboCop** core linting rules
- **RuboCop Rails** for Rails-specific rules
- **RuboCop RSpec** for RSpec test conventions
- **RuboCop FactoryBot** for FactoryBot conventions

### Running RuboCop

```bash
# Check all files
bundle exec rubocop

# Check specific files or directories
bundle exec rubocop app/models app/controllers

# Auto-fix safe offenses
bundle exec rubocop -a

# Show more details
bundle exec rubocop --display-cop-names
```

### Pre-commit Hooks (Recommended)

Consider setting up a pre-commit hook to run linting automatically:

```bash
# Create .git/hooks/pre-commit
#!/bin/sh
bundle exec rubocop -a
bundle exec rspec
```

## Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. **Fork the repository** and clone your fork
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our code style guidelines
4. **Write or update tests** for your changes
5. **Ensure all tests pass** and **linters are happy**:
   ```bash
   bundle exec rspec
   bundle exec rubocop -a
   ```
6. **Commit your changes** with clear, descriptive commit messages
7. **Push to your fork** and **open a Pull Request**

### Pull Request Guidelines

- **Write clear commit messages**: Follow [conventional commits](https://www.conventionalcommits.org/) style
- **Keep PRs focused**: One feature or bug fix per PR
- **Update documentation**: If adding features, update relevant docs
- **Add tests**: New features should include tests
- **Ensure CI passes**: All GitHub Actions checks must pass

### Code Review Process

1. Submit your PR with a clear description
2. Wait for CI to run and pass
3. Address any review feedback
4. Once approved, maintainers will merge your PR

### Development Guidelines

- **Follow Ruby style guide**: We use RuboCop to enforce this
- **Write tests**: Aim for good test coverage
- **Document complex logic**: Add comments for non-obvious code
- **Keep functions focused**: Single responsibility principle
- **Use meaningful names**: Clear variable and method names

## Project Structure

```
character-tracker/
├── app/
│   ├── controllers/        # Rails controllers
│   ├── models/            # ActiveRecord models
│   ├── services/          # Service objects (business logic)
│   ├── serializers/       # JSON serializers
│   ├── javascript/        # React/TypeScript frontend
│   └── graphql/           # GraphQL schema and resolvers
├── spec/                  # RSpec tests
├── config/                # Rails configuration
├── db/                    # Database migrations and seeds
└── lib/                   # Custom libraries and tasks
```

## Database

### Migrations

```bash
# Create a new migration
bin/rails generate migration MigrationName

# Run pending migrations
bin/rails db:migrate

# Rollback last migration
bin/rails db:rollback

# Check migration status
bin/rails db:migrate:status
```

### Seeds

The project includes seed data for spells and class data:
- `lib/seeds/spell_data.json` - D&D 5e spell database
- `lib/seeds/class_data.json` - D&D 5e class rules and features

Load seeds:
```bash
bin/rails db:seed
```

## Troubleshooting

### Common Issues

**Database connection errors:**
- Ensure PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Check `config/database.yml` settings
- Verify database exists: `bin/rails db:create`

**Asset compilation errors:**
- Clear node modules: `rm -rf node_modules && yarn install`
- Clear Rails cache: `bin/rails tmp:clear`

**Bundle install issues:**
- Ensure Ruby version matches: `ruby -v` should show 3.2.1
- Clear bundler cache: `bundle clean --force`

**Docker issues:**
- Rebuild containers: `docker-compose down && docker-compose up --build`
- Check logs: `docker-compose logs web`

## License

[Specify your license here]

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- D&D 5e rules and content referenced from [dnd5e.wikidot.com](https://dnd5e.wikidot.com/)
- Built with [Ruby on Rails](https://rubyonrails.org/)
- Frontend powered by [React](https://react.dev/)
