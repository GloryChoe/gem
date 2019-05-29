({
    createAllInputs : function (component, controllingField, picklistValue, fieldList, fieldNameToFieldLabel) {
        // Need to add the sobject to the map of string to sobject
        var componentList = [];
        var layoutItemIndexList = [];
        var rowDisabled = component.get("v.rowDisabled");

        // Given the list of fields that should be shown for this particular picklist value,
        // Create a lightning layout item and also a lighting input field. 
        for (var j = 0; j < fieldList.length; j++) {
            var fieldName = fieldList[j];
            var fieldRecordValueRef = component.getReference('v.sobjectRecord.' + fieldName);
            var fieldNameToDescribe = this.proxyToObj(fieldNameToFieldLabel);
            var fieldType = fieldNameToDescribe[fieldName]['Type'];
            var fieldLabel = fieldNameToDescribe[fieldName]['Label'];
            
            var layoutItem = ["lightning:layoutItem", {
                            "padding" : "horizontal-small",
                            "class": "slds-p-bottom_small",
                            "size": "6",
                            "mediumDeviceSize": "3"
            }];

            var componentType = "lightning:inputField";
            var inputJSON = {
                "disabled" : rowDisabled
            };

            // For some reason, Checkbox inputFields don't get their values set correctly...
            if(fieldType == 'BOOLEAN'){
                componentType = "lightning:input";
                inputJSON["checked"] = fieldRecordValueRef;
                inputJSON["label"] = fieldLabel;
                inputJSON["type"] = "checkbox";
            } else {
                inputJSON["fieldName"] = fieldList[j];
                inputJSON["value"] = fieldRecordValueRef;
            }

            var inputField = [componentType, inputJSON];

            componentList.push(layoutItem);

            // Keep track of the index of layout items. 
            // So we know which items are layout items instead of inputfields. 
            layoutItemIndexList.push(componentList.length - 1);

            componentList.push(inputField);
        }

        $A.createComponents(componentList, function(createdComponentsList, status, errorMessage) {
            if (status == "SUCCESS") {
                var body = component.get("v.body");
                var layoutItem; 

                // Go through the created component list and process them
                // Set the input fields into the body of the layout items
                for (var i = 0; i < createdComponentsList.length; i++) {
                    var thisCmp = createdComponentsList[i];
                    if (layoutItemIndexList.includes(i)) {
                        layoutItem = thisCmp;
                    } else {
                        var inputField = thisCmp;
                        layoutItem.set("v.body", inputField);
                        // The new layoutItem now has its input, push it to the component body
                        body.push(layoutItem);
                    }
                }

                // Put everything into the body.
                component.set("v.body", body);
            } else if (status == "INCOMPLETE") {
                this.showErrorToast(errorMessage, 'Error')
            } else if (status == "ERROR") {
                console.log('error here');
                console.log(errorMessage);
                this.showErrorToast(errorMessage, 'Error')
            }
        });

    },
    showErrorToast: function(msgText, title){
        var toastEvent = $A.get('e.force:showToast');
        toastEvent.setParams({
            title : title ? title : $A.get('$Label.c.Error'),
            message: msgText,
            type: 'error',
            mode: 'sticky'
        });
        toastEvent.fire();
    },
    processSobjectRecord: function(component) {
        // Check to see if the sobject Record is empty or not. 
        // If it is empty, that means that an existing record was not passed in
        // If that is the case, give it an sobject type
        // Afterwards, update the display Section boolean 
        var sobjectRecord = component.get('v.sobjectRecord');
        var sobjectType = component.get('v.objectName');

        if ($A.util.isEmpty(sobjectRecord)) {
            component.set('v.sobjectRecord.sobjectType', sobjectType);
        }

        var objectNameToSobject = component.get('v.objectNameToSobject');

        var sobjectList = objectNameToSobject[sobjectType] || [];
        sobjectList.push(sobjectRecord);
        component.set('v.objectNameToSobject', sobjectList);

        var controllingField = component.get('v.controllingField');
        var picklistValue = component.get('v.pickListValue');

        var fieldList = component.get('v.fieldList');
        var fieldNameToFieldLabel = component.get('v.fieldNameToFieldLabel')

        var customMetadataJSON = this.createAllInputs(component, controllingField, 
            picklistValue, fieldList, fieldNameToFieldLabel );

        this.handleSobjectChange(component, sobjectRecord, controllingField, picklistValue);
    },
    handleSobjectChange: function(component, sobjectRecord, controllingField, picklistValue) {
        // We set the display section to true if the sobject record's selected picklist value
        // is the same as the picklast value this section is for. 
        // If it is not the same picklist value, we hide the section because these fields should not be shown
        // for the selected picklist value
        var sobjectRecordSelectedPicklistValue = sobjectRecord[controllingField];

        var currentChoice = component.get("v.currentChoice");
        // Only run this when the controlling picklist field changes
        if(sobjectRecordSelectedPicklistValue == currentChoice){
            return;
        } else {
            component.set("v.currentChoice", sobjectRecordSelectedPicklistValue);
        }

        if (sobjectRecordSelectedPicklistValue != null && sobjectRecordSelectedPicklistValue != undefined) {
            if (sobjectRecordSelectedPicklistValue == picklistValue) {
                component.set('v.displaySection', true);
            } else {
                component.set('v.displaySection', false);
            }
        } else {
            component.set('v.displaySection', false);
        }
        
    },
    proxyToObj: function(attr){
        // Used to convert a Proxy object to an actual Javascript object
        return JSON.parse(JSON.stringify(attr));
    }
})
