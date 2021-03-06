# GEM Automation Inventory

## Key Flows

This table describes the key flows for developers, QEs, and technical
writers.

| Flow                | Description                                | Managed |
| ------------------- | ------------------------------------------ | ------- |
| `dev_org`           | Minimal development                        |         |
| `dev_org_beta_deps` | Minimal development (Latest NPSP/EDA Beta) |         |
| `qa_org`            | Feature/robot testing                      |         |
| `regression_org`    | Regression testing                         | ✔       |
| `trial_org`         | Trialforce Source Org/Installer            | ✔       |
| `existing_org`      | Installer - Production Orgs                | ✔       |

## Unpackaged Metadata

Unpackaged directory structure:

```
unpackaged
└── config
    ├── delete
    ├── dev
    ├── qa
    ├── recommended
    └── trial
```

Each directory is used as follows:

| Directory      | Purpose                                         | Retrieve declarative changes |
| -------------- | ----------------------------------------------- | ---------------------------- |
| `delete/`      | Deletes `dev` metadata                          |                              |
| `dev/`         | Default dev metadata                            | `retrieve_config_dev`        |
| `qa/`          | Additional configuration for testing/docs       | `retrieve_config_qa`         |
| `recommended/` | Default profiles, record types, for end-users   | `retrieve_config_recommended` |
| `trial/`       | Trial configuration, default installation setup | `retrieve_config_trial`    |
