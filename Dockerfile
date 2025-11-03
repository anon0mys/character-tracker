FROM ruby:3.2.1

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -y \
    nodejs \
    postgresql-client \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Yarn using the official installation script
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
ENV PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

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