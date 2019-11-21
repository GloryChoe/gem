from cumulusci.core.utils import process_list_arg
from cumulusci.tasks.salesforce import BaseSalesforceApiTask
from cumulusci.salesforce_api.utils import get_simple_salesforce_connection


class CheckExistingRecordTypes(BaseSalesforceApiTask):
    """
    Checks for existing Opportunity record types, deploys GEM Record Types if not found.
    """

    task_options = {
        "sobject": {
            "description": "SObject for which record types will be retrieved",
            "required": True,
        },
        "ignored_record_types": {
            "description": "Developer names for record types to ignore."
        },
        "filtered_record_types": {
            "description": "Developer names for record types. Blocks deployment if any existing record types with these names is found.",
            "required": True,
        },
    }

    def _run_task(self):
        business_process_exists = self.business_process_exists()
        record_types_exist = self.record_types_exist()
        if record_types_exist:
            self.return_values["record_types_exist"] = True
        else:
            self.return_values = None

    def record_types_exist(self):
        sobject = self.options["sobject"]
        sf = get_simple_salesforce_connection(
            self.project_config,
            self.org_config,
            api_version=self.project_config.api_version,
        )
        describe_results = getattr(sf, sobject).describe()
        record_types = [
            rt for rt in describe_results["recordTypeInfos"] if not rt["master"]
        ]

        if "ignored_record_types" in self.options:
            ignored_names = process_list_arg(self.options["ignored_record_types"])
            record_types = [
                rt for rt in record_types if rt["developerName"] not in ignored_names
            ]

        filtered_names = set(process_list_arg(self.options["filtered_record_types"]))
        recordtypes_exist = any(
            rt["developerName"] in filtered_names for rt in record_types
        )
        self.logger.info(
            f"Existing record types on {sobject} {'not ' if not recordtypes_exist else ''}found."
        )
        if recordtypes_exist:
            found_record_types = ", ".join(
                [
                    rt["developerName"]
                    for rt in record_types
                    if rt["developerName"] in filtered_names
                ]
            )
            self.logger.info(
                f"Found the following filtered record types: {found_record_types}"
            )
        return recordtypes_exist

    def business_process_exists(self):
        sobject = self.options["sobject"]
        tooling = get_simple_salesforce_connection(
            self.project_config,
            self.org_config,
            api_version=self.project_config.api_version,
        )
        tooling.base_url += "tooling/"
        business_process_result = tooling.query(
            "SELECT Id FROM BusinessProcess WHERE Name = 'NPSP_Default'"
        )
        business_process_exists = business_process_result["size"] > 0
        self.logger.info(
            f"Existing NPSP_Default BusinessProcess on {sobject} {'not ' if not business_process_exists  else ''}found."
        )

        return business_process_exists
