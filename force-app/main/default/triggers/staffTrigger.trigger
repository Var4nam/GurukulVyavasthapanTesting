trigger staffTrigger on Staff__c (after insert) {
    if(Trigger.isAfter && Trigger.isInsert){
        credProvider.credCreation(Trigger.new);
    }
}