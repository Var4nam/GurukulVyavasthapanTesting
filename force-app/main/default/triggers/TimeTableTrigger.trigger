trigger TimeTableTrigger on TimeTable__c (before update, after insert, after update, after delete) {
    if(trigger.isBefore && trigger.isUpdate){
        TimeTableTriggerHandler.teacherIsPresent(trigger.new);
    }
    if (Trigger.isAfter) {
        if (Trigger.isInsert || Trigger.isUpdate) {
            TimeTableHandler.handleInsertOrUpdate(Trigger.new);
        } else if (Trigger.isDelete) {
            TimeTableHandler.handleDelete(Trigger.old);
        }
    }

}