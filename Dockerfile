FROM ruby:3.2.1

# Set environment variables that affect dependency installation early
# This ensures these layers are cached separately from dependency changes
ENV BUNDLE_WITHOUT=""
ENV BUNDLE_PATH="/usr/local/bundle"
ENV PATH="/usr/local/bundle/bin:$PATH"
ENV NODE_VERSION="18.x"

# Install system dependencies with apt cache
# This layer will be cached unless system packages change
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update -qq && \
    apt-get install -y \
    postgresql-client \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18.x from NodeSource
# This layer will be cached unless Node.js version changes
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION} | bash - && \
    apt-get install -y nodejs

# Install Yarn globally using npm
# This layer will be cached unless Yarn version changes
RUN npm install -g yarn

WORKDIR /app

# Copy Ruby dependency files first
# This layer will be cached unless Gemfile or Gemfile.lock changes
COPY Gemfile Gemfile.lock ./

# Install Ruby dependencies
# This layer will be cached unless Gemfile.lock changes
# Cache bundler's download cache (speeds up install during build)
# Gems are installed to /usr/local/bundle in the image layers (persisted via layer cache)
RUN --mount=type=cache,target=/root/.bundle/cache,sharing=locked \
    bundle config set --global path /usr/local/bundle && \
    bundle config set --global without '' && \
    bundle install --jobs=4 --retry=3 && \
    bundle show rubocop && \
    bundle show spring && \
    ls -la /usr/local/bundle/bin/ | head -10

# Copy JavaScript dependency files
# This layer will be cached unless package.json or yarn.lock changes
COPY package.json yarn.lock ./

# Install JavaScript dependencies with yarn cache
# This layer will be cached unless yarn.lock changes
# Cache yarn's cache directory (speeds up install during build)
# node_modules are installed in the image layers (persisted via layer cache)
RUN --mount=type=cache,target=/root/.yarn,sharing=locked \
    yarn install --frozen-lockfile

# Copy application code last
# This layer will be rebuilt on every code change, but all previous layers stay cached
COPY . .

# Build CSS assets (PostCSS/Tailwind) before the application runs
# This ensures compiled CSS is available and prevents SassC from trying to process PostCSS syntax
RUN yarn build:css

EXPOSE 3000

# Configure the main process to run when running the image
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]