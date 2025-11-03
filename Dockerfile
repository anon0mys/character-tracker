FROM ruby:3.2.1

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -y \
    postgresql-client \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18.x from NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install Yarn globally using npm
RUN npm install -g yarn

WORKDIR /app

# Copy dependency files
COPY Gemfile Gemfile.lock ./

# Install Ruby dependencies
RUN bundle install

# Copy package files
COPY package.json yarn.lock ./

# Install JavaScript dependencies
RUN yarn install --frozen-lockfile

# Copy application code
COPY . .

EXPOSE 3000

# Configure the main process to run when running the image
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]