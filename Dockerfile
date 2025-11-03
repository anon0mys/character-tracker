FROM ruby:3.2.1

# Install system dependencies with apt cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update -qq && \
    apt-get install -y \
    postgresql-client \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18.x from NodeSource
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Yarn globally using npm
RUN npm install -g yarn

WORKDIR /app

# Copy dependency files
COPY Gemfile Gemfile.lock ./

# Install Ruby dependencies with bundler cache (including all groups)
# Set BUNDLE_WITHOUT to empty to ensure all groups are installed
ENV BUNDLE_WITHOUT=""
RUN --mount=type=cache,target=/usr/local/bundle \
    bundle install --jobs=4 --retry=3

# Copy package files
COPY package.json yarn.lock ./

# Install JavaScript dependencies with yarn cache
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

# Copy application code
COPY . .

EXPOSE 3000

# Configure the main process to run when running the image
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]