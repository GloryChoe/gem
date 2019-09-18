({
    getBatchInformation : function(component, batchId) {
        
        var action = component.get('c.initBatch');
        
        action.setParams({
            batchId: batchId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var giftBatchModel = response.getReturnValue();
                component.set('v.giftBatchModel', giftBatchModel);
                component.set('v.bdiLabels', giftBatchModel.bdiLabels);
                component.set('v.diBatch', giftBatchModel.diBatch);
                component.set('v.diList', giftBatchModel.diList);
            } else if (state === 'ERROR') {
                // TODO: Send event with error message for giftEntry component to handle?
                //this.handleError(component, response);
            }
        
        });
        
        $A.enqueueAction(action);
		
    }
})