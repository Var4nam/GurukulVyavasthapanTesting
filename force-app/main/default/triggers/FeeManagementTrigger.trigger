trigger FeeManagementTrigger on Fee_Management__c (before update) {

    if(Trigger.isBefore && Trigger.isUpdate){
        FeeManagementTriggerHandler.storeJSONForFee(Trigger.new, Trigger.oldMap);
    }
}