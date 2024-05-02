trigger AuthenticationTrigger on Authentication__c (before insert) {
    if(Trigger.isBefore && Trigger.isInsert){
        AuthenticationTriggerHandler.recordVerification(Trigger.new);
    }
}