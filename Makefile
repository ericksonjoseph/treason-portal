PROJECT_ROOT:=$(shell dirname $(shell dirname $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))))

# Recipes that should be run even if a filename matching the receipe already exists
.DEFAULT: help

# This syntax ensures that we dont leave config values behind in the running env.
SET_ENV_VARS=env $$(grep -v '^\#' config/config.env | xargs)

NAME=portal

all: help

.PHONY: init
init: ## Setup application to run locally
	. ~/.nvm/nvm.sh && nvm use 20

.PHONY: run
run: ## Run app in dev mode
	${SET_ENV_VARS} npm run dev

.PHONY: regression
regression: ## Run playwright regression tests
	${SET_ENV_VARS} npx playwright test --ui

.PHONY: migration
migration: ## Create migration
	${SET_ENV_VARS} npx drizzle-kit generate --config ./drizzle.config.ts

.PHONY: migrate
migrate: ## Apply migration
	${SET_ENV_VARS} npx drizzle-kit push --config ./drizzle.config.ts

.PHONY: rollback
rollback: ## Rollback migration
	${SET_ENV_VARS} npx drizzle-kit down --config ./drizzle.config.ts
