({
    getBatchInformation : function(component, batchId) {
        
        var action = component.get('c.initBatch');
        
        action.setParams({
            batchId: batchId
        });
        
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            console.log(state);
            if (state === 'SUCCESS') {
                
                var giftBatchModel = response.getReturnValue();
                component.set('v.giftBatchModel', giftBatchModel);
                component.set('v.diBatch', giftBatchModel.diBatch);
                console.log(giftBatchModel.diList);
                component.set('v.diList', giftBatchModel.diList);
                
            } else if (state === 'ERROR') {
                //component.set('v.showForm', false);
                //this.handleError(component, response);
                //component.set('v.showSpinner', false);
            }
        
        });
        
        $A.enqueueAction(action);
		
	}
})