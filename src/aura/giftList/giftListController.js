({
	doInit: function(component, event, helper) {
        //component.set('v.showSpinner', true);
        var recordId = component.get('v.recordId');
        // Get the data model class for the form
        // Includes picklist options, field labels, and objects if loading an existing record
        helper.getBatchInformation(component, recordId);

        // Set the namespace var so components load in managed package
        var namespace = component.getType().split(':')[0];
        //component.set('v.namespacePrefix', namespace);
        //if(namespace !== 'c'){
            //component.set('v.namespaceFieldPrefix', namespace+'__');
        //}
    },
    handleEdit: function(component, event, helper){
        var diId = event.currentTarget.dataset.importid;
        //console.log(diId); 
        component.set("v.currentDiId", diId);
    }
})