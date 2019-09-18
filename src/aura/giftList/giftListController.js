({
	doInit: function(component, event, helper) {
        var recordId = component.get('v.recordId');
        helper.getBatchInformation(component, recordId);
    },
    handleEdit: function(component, event, helper){
        let index = event.currentTarget.dataset.index;
        component.set("v.diIndexChosen", index);
    },
    handleProcessBatch: function(component, event, helper){
        const returnUL = '/006'
        const batchId = component.get('v.recordId');
        const bdiBatchClass = component.get('v.bdiLabels.bdiBatchClass');
        let url = '/apex/' + bdiBatchClass + '?batchId=' + batchId + '&retURL=' + returnUL;
        let urlEvent = $A.get('e.force:navigateToURL');
        urlEvent.setParams({
            'url': url
        });
        urlEvent.fire();
    },
    handleDelete: function(component, event, helper){
        let index = event.currentTarget.dataset.index;
        let diList = component.get('v.diList');
        let diToDelete = diList[index];

        let action = component.get('c.deleteDiRecord');
        action.setParams({
            diId: diToDelete.Id
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                diList.splice(index,1);
                component.set('v.diList', diList);
                
                // TODO: Move this to giftEntry to use toast messages more easily
                console.log('Deleted');

            } else if (state === 'ERROR') {
                //this.handleError(component, response);
            }
        });

        $A.enqueueAction(action);
    },
    handleNewGift: function(component, event, helper){
        component.set("v.diIndexChosen", -1);
    }
})